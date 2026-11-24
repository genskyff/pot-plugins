import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

export const keyName = (provider) => `${provider.toUpperCase()}_API_KEY`;

export function providersOf(kind) {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${kind}-`))
    .map((entry) => entry.name.slice(kind.length + 1))
    .sort();
}

const secrets = new Set();

export function redact(value) {
  let text = String(value);
  for (const secret of secrets) {
    text = text.replaceAll(secret, '[KEY]');
  }
  return text;
}

function promptSpan(code, dir) {
  const anchor = code.search(/\bsystem(?:_instruction)?: `|role: 'system',/);
  const start = code.indexOf('`', anchor);
  const end = code.indexOf('`', start + 1);
  if (anchor === -1 || start === -1 || end === -1) {
    throw new Error(`${dir}: system prompt not found`);
  }
  return [start + 1, end];
}

function withPrompt(code, dir, prompt) {
  if (/[`\\]|\$\{/.test(prompt)) {
    throw new Error('prompt text must not contain backticks, backslashes or ${');
  }
  const [start, end] = promptSpan(code, dir);
  return code.slice(0, start) + prompt + code.slice(end);
}

export const readPromptFile = (file) => readFileSync(file, 'utf8').replaceAll('\r\n', '\n').trim();

// variant: { label: 'old' } reads the plugin from the git ref `base`, { label: 'new' } from the
// working tree, and { label, prompt } puts a candidate prompt into the working-tree plugin.
function pluginCode(dir, variant, base) {
  if (variant.label === 'old') {
    return execFileSync('git', ['-C', ROOT, 'show', `${base}:${dir}/main.js`], {
      encoding: 'utf8',
    });
  }
  const code = readFileSync(join(ROOT, dir, 'main.js'), 'utf8');
  return variant.prompt === undefined ? code : withPrompt(code, dir, variant.prompt);
}

export function promptOf(kind, provider, variant, base) {
  const dir = `${kind}-${provider}`;
  const code = pluginCode(dir, variant, base);
  const [start, end] = promptSpan(code, dir);
  return code.slice(start, end);
}

export function applyPrompt(kind, prompt) {
  for (const provider of providersOf(kind)) {
    const dir = `${kind}-${provider}`;
    const file = join(ROOT, dir, 'main.js');
    writeFileSync(file, withPrompt(readFileSync(file, 'utf8'), dir, prompt));
  }
}

const RETRY_DELAYS = [3000, 8000, 20_000];

// Same call shape and response shape as the tauriFetch that pot passes to plugins.
// `seen` receives what the response says about itself: the model, and whether the request failed.
function liveFetch(usage, seen) {
  return async (url, init) => {
    for (let attempt = 0; ; attempt++) {
      const last = attempt === RETRY_DELAYS.length;
      let res;
      let text;
      try {
        res = await globalThis.fetch(url, {
          method: init.method,
          headers: init.headers,
          body: JSON.stringify(init.body.payload),
          signal: globalThis.AbortSignal.timeout(180_000),
        });
        text = await res.text();
      } catch (error) {
        if (last) {
          seen.failed = true;
          throw `network: ${error.message}`;
        }
      }

      if (!last && (!res || res.status === 429 || res.status >= 500)) {
        usage.retries++;
        await sleep(RETRY_DELAYS[attempt]);
        continue;
      }

      let data = text;
      try {
        data = JSON.parse(text);
      } catch {
        // keep the raw body for the plugin's error message
      }
      usage.calls++;
      const used = data?.usage ?? {};
      usage.input += used.prompt_tokens ?? used.input_tokens ?? used.total_input_tokens ?? 0;
      // Gemini reports thought tokens apart from output tokens; both are billed as output.
      usage.output +=
        used.completion_tokens ??
        used.output_tokens ??
        (used.total_output_tokens ?? 0) + (used.total_thought_tokens ?? 0);
      seen.model = data?.model;
      seen.failed = !res.ok;
      return { ok: res.ok, status: res.status, data };
    }
  };
}

function dryFetch(sent) {
  return async (_url, init) => {
    sent.push(init.body.payload);
    return {
      ok: true,
      status: 200,
      data: {
        choices: [{ message: { content: 'dry' } }],
        content: [{ type: 'text', text: 'dry' }],
        steps: [{ type: 'model_output', content: [{ type: 'text', text: 'dry' }] }],
      },
    };
  };
}

const partsText = (content) =>
  typeof content === 'string'
    ? content
    : content.map((part) => (part.type === 'text' ? part.text : `[${part.type}]`)).join(' + ');

const geminiInput = (input) =>
  typeof input === 'string' ? input : input.find((step) => step.type === 'user_input').content;

export function describePayload(payload) {
  const system =
    payload.system ??
    payload.system_instruction ??
    payload.messages.find((message) => message.role === 'system').content;
  const user = payload.messages
    ? payload.messages.find((message) => message.role === 'user').content
    : geminiInput(payload.input);
  return { model: payload.model, system: partsText(system), user: partsText(user) };
}

export function loadPlugin({ kind, provider, variant, base, key, dry }) {
  const dir = `${kind}-${provider}`;
  const plugin = vm.runInNewContext(`${pluginCode(dir, variant, base)}\n;${kind}`);
  const usage = { calls: 0, input: 0, output: 0, retries: 0 };
  const sent = [];
  if (key) {
    secrets.add(key);
  }

  // Resolves to { output }, to { error } when the plugin rejects the response,
  // or to { failure } when the request itself failed.
  const call = async (args, config) => {
    const seen = {};
    const tauriFetch = dry ? dryFetch(sent) : liveFetch(usage, seen);
    try {
      const output = await plugin(...args, {
        config: { ...config, apiKey: key ?? 'dry' },
        utils: { tauriFetch },
      });
      return { output, model: seen.model };
    } catch (error) {
      const message = redact(typeof error === 'string' ? error : (error?.message ?? error));
      return seen.failed ? { failure: message } : { error: message, model: seen.model };
    }
  };

  return { call, usage, sent };
}

export async function pool(tasks, size) {
  const results = Array.from({ length: tasks.length });
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) {
      const index = next++;
      results[index] = await tasks[index]();
    }
  };
  await Promise.all(Array.from({ length: size }, worker));
  return results;
}
