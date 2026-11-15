import { execFileSync } from 'node:child_process';
import console from 'node:console';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import process from 'node:process';
import { setTimeout as sleep } from 'node:timers/promises';
import { parseArgs } from 'node:util';
import {
  ROOT,
  applyPrompt,
  describePayload,
  keyName,
  loadPlugin,
  pool,
  promptOf,
  providersOf,
  readPromptFile,
  redact,
} from './lib.mjs';

const KINDS = ['translate', 'recognize'];
const MAX_FAILURES_IN_A_ROW = 10;

const HELP = `A/B test the plugin prompts against real models.

Usage:
  node tests/ab.mjs run <translate|recognize> [options]
  node tests/ab.mjs show <results.json> [case id or group ...]
  node tests/ab.mjs apply <translate|recognize> <prompt.txt>

run sends every case through the plugins' own main.js, once per variant and repetition:
  --variants a,b     old (main.js at --base), new (working tree), or a prompt text file
                     that replaces the system prompt of the working-tree plugin (default: old,new)
  --base <ref>       git ref for "old" (default: HEAD)
  --providers a,b    plugin name suffixes such as deepseek,openai (default: every provider with a key)
  --only a,b         case ids or groups (default: all)
  --reps <n>         repetitions per case and variant (default: 3)
  --set p.key=value  plugin config for provider p, or * for all, e.g. --set deepseek.thinking=disabled
  --concurrency a,b  parallel requests per provider: n for all, provider=n for one (default: 4)
  --pause a,b        seconds to wait before each request, same form, for rate-limited accounts
                     (e.g. --concurrency kimi=1 --pause kimi=21 stays under 3 requests a minute)
  --dry              send nothing; print the prompts each plugin would send, for all providers

Providers run in parallel and each writes its own file under tests/results when it finishes.
A provider stops after ${MAX_FAILURES_IN_A_ROW} failed requests in a row; failed requests are counted apart from the cases.

show prints the distinct outputs behind a result file, by default for cases that did not pass everywhere.
apply writes one prompt text into every plugin of that kind.

API keys come from <PROVIDER>_API_KEY, for example DEEPSEEK_API_KEY. Store one with
"fnox set DEEPSEEK_API_KEY" and start this through "mise run ab", which wraps it in "fnox exec".`;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function toVariant(name) {
  if (name === 'old' || name === 'new') {
    return { label: name };
  }
  return { label: basename(name, extname(name)), prompt: readPromptFile(name) };
}

function parseSets(sets, providers) {
  const config = Object.fromEntries(providers.map((provider) => [provider, {}]));
  for (const entry of sets) {
    const match = /^([^.=]+)\.([^.=]+)=(.*)$/.exec(entry);
    if (!match) {
      fail(`--set expects provider.key=value, got ${entry}`);
    }
    const [, target, key, value] = match;
    if (target !== '*' && !providers.includes(target)) {
      fail(`--set: unknown provider ${target}`);
    }
    for (const provider of target === '*' ? providers : [target]) {
      config[provider][key] = value;
    }
  }
  return config;
}

// "4,kimi=1": 4 for every provider, 1 for kimi.
function parsePerProvider(option, text, providers, fallback, min) {
  const values = Object.fromEntries(providers.map((provider) => [provider, fallback]));
  for (const entry of text.split(',').filter(Boolean)) {
    const [name, value] = entry.includes('=') ? entry.split('=') : ['*', entry];
    const number = Number(value);
    if (!(number >= min) || (name !== '*' && !providers.includes(name))) {
      fail(`--${option} expects n or provider=n, got ${entry}`);
    }
    for (const provider of name === '*' ? providers : [name]) {
      values[provider] = number;
    }
  }
  return values;
}

function judge(suite, item, result) {
  if (result.error !== undefined) {
    return item.onError ? item.onError(result.error) : `error: ${result.error.slice(0, 200)}`;
  }
  const verdict = suite.preflight(result.output, item);
  return verdict === true ? item.check(result.output) : verdict;
}

const isSoft = (verdict) => typeof verdict === 'string' && verdict.startsWith('soft:');
const judged = (runs) => runs.filter((run) => run.failure === undefined);

// "12+3s/16 !2": 12 passed, 3 soft, 16 judged, 2 requests failed.
function cell(runs) {
  const done = judged(runs);
  const pass = done.filter((run) => run.verdict === true).length;
  const soft = done.filter((run) => isSoft(run.verdict)).length;
  const failed = runs.length - done.length;
  return `${pass}${soft ? `+${soft}s` : ''}/${done.length}${failed ? ` !${failed}` : ''}`;
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  }
  return counts;
}

function report(provider, cases, labels, runs) {
  const out = [];
  const row = (name, ids) => {
    const cells = labels.map((label) =>
      `${label} ${cell(runs.filter((run) => run.variant === label && ids.has(run.id)))}`.padEnd(20),
    );
    out.push(`  ${name.padEnd(22)}${cells.join('')}`);
  };
  const idsOf = (items) => new Set(items.map((item) => item.id));

  out.push(`\n== ${provider}   pass(+soft)/judged per variant, !n = failed requests`);
  for (const group of new Set(cases.map((item) => item.group))) {
    row(group, idsOf(cases.filter((item) => item.group === group)));
  }
  row('TOTAL', idsOf(cases));

  out.push('  -- cases that did not pass everywhere');
  for (const id of idsOf(judged(runs).filter((run) => run.verdict !== true))) {
    row(id, new Set([id]));
  }

  out.push('  -- hard failures');
  const hard = judged(runs).filter((run) => run.verdict !== true && !isSoft(run.verdict));
  const lines = countBy(
    hard,
    (run) =>
      `${run.id} ${run.variant} [${run.verdict}] ${JSON.stringify(run.output ?? null).slice(0, 160)}`,
  );
  for (const [line, count] of lines) {
    out.push(`  x${count} ${line}`);
  }

  const failures = countBy(
    runs.filter((run) => run.failure !== undefined),
    (run) => run.failure.replaceAll(/\s+/g, ' ').slice(0, 160),
  );
  if (failures.size > 0) {
    out.push('  -- failed requests');
    for (const [line, count] of failures) {
      out.push(`  x${count} ${line}`);
    }
  }
  return out.join('\n');
}

function printDry(kind, providers, variants, plugins) {
  console.log(`${kind}: dry run, nothing was sent\n`);
  for (const variant of variants) {
    const hashes = new Set();
    for (const provider of providers) {
      const { model, system, user } = describePayload(plugins[provider][variant.label].sent[0]);
      const hash = createHash('sha256').update(system).digest('hex').slice(0, 8);
      hashes.add(hash);
      console.log(
        `${variant.label.padEnd(10)}${provider.padEnd(12)}${String(model).padEnd(20)}system ${hash} ${system.length} chars`,
      );
      if (provider === providers[0]) {
        console.log(`  user: ${JSON.stringify(user).slice(0, 200)}`);
      }
    }
    console.log(
      `${variant.label}: ${providers.length} providers, ${hashes.size} distinct system prompt(s)\n`,
    );
  }
}

async function run(kind, options) {
  const suite = await import(`./${kind}.mjs`);
  const variants = options.variants.split(',').map(toVariant);
  const labels = variants.map((variant) => variant.label);
  const all = providersOf(kind);
  const wanted = options.providers ? options.providers.split(',') : all;
  const unknown = wanted.filter((provider) => !all.includes(provider));
  if (unknown.length > 0) {
    fail(`unknown provider: ${unknown.join(', ')} (known: ${all.join(', ')})`);
  }
  const providers = options.dry
    ? wanted
    : wanted.filter((provider) => process.env[keyName(provider)]);
  const skipped = wanted.filter((provider) => !providers.includes(provider));
  if (providers.length === 0) {
    fail(`no API key found; set one of: ${wanted.map(keyName).join(', ')}`);
  }

  const only = options.only?.split(',');
  const cases = suite.cases.filter(
    (item) => !only || only.includes(item.id) || only.includes(item.group),
  );
  const selected = options.dry ? cases.slice(0, 1) : cases;
  if (selected.length === 0) {
    fail(`no case matches --only ${options.only}`);
  }
  const reps = options.dry ? 1 : Number(options.reps);
  const config = parseSets(options.set, all);
  const limits = parsePerProvider('concurrency', options.concurrency, all, 4, 1);
  const pauses = parsePerProvider('pause', options.pause, all, 0, 0);

  const plugins = {};
  for (const provider of providers) {
    plugins[provider] = {};
    for (const variant of variants) {
      const key = options.dry ? undefined : process.env[keyName(provider)];
      plugins[provider][variant.label] = loadPlugin({
        kind,
        provider,
        variant,
        base: options.base,
        key,
        dry: options.dry,
      });
    }
  }

  const started = new Date();
  const stamp = started.toISOString().replaceAll(/[-:.]/g, '').slice(0, 18);
  const base = execFileSync('git', ['-C', ROOT, 'rev-parse', '--short', options.base], {
    encoding: 'utf8',
  }).trim();
  mkdirSync(join(ROOT, 'tests', 'results'), { recursive: true });
  if (!options.dry) {
    console.log(`${kind}: ${selected.length} cases x ${reps} reps, variants ${labels.join(', ')}`);
  }

  const runProvider = async (provider) => {
    let failuresInARow = 0;
    const tasks = [];
    for (const item of selected) {
      for (const label of labels) {
        for (let rep = 0; rep < reps; rep++) {
          tasks.push(async () => {
            const ids = { id: item.id, variant: label };
            if (failuresInARow >= MAX_FAILURES_IN_A_ROW) {
              return { ...ids, failure: 'not sent: the provider was stopped' };
            }
            await sleep(pauses[provider] * 1000);
            const { args, config: caseConfig } = suite.request(item);
            const result = await plugins[provider][label].call(args, {
              ...config[provider],
              ...caseConfig,
            });
            if (result.failure !== undefined) {
              failuresInARow++;
              return { ...ids, ...result };
            }
            failuresInARow = 0;
            return { ...ids, ...result, verdict: judge(suite, item, result) };
          });
        }
      }
    }
    const runs = await pool(tasks, limits[provider]);
    if (options.dry) {
      return { provider, runs };
    }

    const usage = { calls: 0, input: 0, output: 0, retries: 0 };
    for (const label of labels) {
      for (const [name, value] of Object.entries(plugins[provider][label].usage)) {
        usage[name] += value;
      }
    }
    usage.seconds = Math.round((Date.now() - started) / 1000);
    const models = Object.fromEntries(
      countBy(
        runs.filter((item) => item.model),
        (item) => item.model,
      ),
    );
    const file = join(ROOT, 'tests', 'results', `${kind}-${stamp}-${provider}.json`);
    const data = {
      kind,
      provider,
      started: started.toISOString(),
      base,
      reps,
      variants: variants.map((variant) => ({
        label: variant.label,
        prompt: promptOf(kind, provider, variant, options.base),
      })),
      config: config[provider],
      usage,
      models,
      cases: selected.map((item) => ({
        id: item.id,
        group: item.group,
        input: suite.describe(item),
      })),
      runs,
    };
    writeFileSync(file, redact(JSON.stringify(data, null, 1)));
    console.log(
      `${report(provider, selected, labels, runs)}\n  -- config ${JSON.stringify(config[provider])}  models ${JSON.stringify(models)}\n  -- usage ${JSON.stringify(usage)}  results ${file}`,
    );
    return { provider, runs, models };
  };

  const done = await Promise.all(providers.map(runProvider));

  if (options.dry) {
    printDry(kind, providers, variants, plugins);
    return;
  }

  console.log('\n== summary   pass(+soft)/judged per variant, !n = failed requests');
  for (const { provider, runs, models } of done) {
    const cells = labels.map((label) =>
      `${label} ${cell(runs.filter((item) => item.variant === label))}`.padEnd(20),
    );
    console.log(`  ${provider.padEnd(12)}${cells.join('')}${Object.keys(models).join(', ')}`);
  }

  // One model failing a case says little about the prompt; several failing the same case does.
  console.log('  -- cases with hard failures on two or more providers');
  for (const item of selected) {
    const cells = labels.map((label) => {
      const failing = done.filter(({ runs }) =>
        judged(runs).some(
          (r) =>
            r.id === item.id && r.variant === label && r.verdict !== true && !isSoft(r.verdict),
        ),
      );
      return { label, names: failing.map(({ provider }) => provider) };
    });
    if (cells.some(({ names }) => names.length >= 2)) {
      const text = cells.map(({ label, names }) => `${label}: ${names.join(' ') || '-'}`);
      console.log(`  ${item.id.padEnd(22)}${text.join('   ')}`);
    }
  }
  if (skipped.length > 0) {
    console.log(
      `skipped, no key: ${skipped.map((provider) => `${provider} (${keyName(provider)})`).join(', ')}`,
    );
  }
}

function show(file, filters) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const notPassed = new Set(
    data.runs.filter((item) => item.verdict !== true).map((item) => item.id),
  );
  const cases = data.cases.filter((item) =>
    filters.length > 0
      ? filters.includes(item.id) || filters.includes(item.group)
      : notPassed.has(item.id),
  );
  console.log(
    `${data.provider}  ${JSON.stringify(data.config)}  ${Object.keys(data.models).join(', ')}`,
  );
  for (const item of cases) {
    console.log(`\n## ${item.id}  ${item.input.slice(0, 140)}`);
    for (const { label } of data.variants) {
      const runs = data.runs.filter((r) => r.id === item.id && r.variant === label);
      const lines = countBy(runs, (r) => {
        if (r.failure !== undefined) {
          return `request failed: ${r.failure.replaceAll(/\s+/g, ' ').slice(0, 120)}`;
        }
        return `${JSON.stringify(r.output ?? null)} ${r.verdict === true ? 'ok' : `<${r.verdict}>`}`;
      });
      for (const [line, count] of lines) {
        console.log(`  ${label.padEnd(6)} x${count} ${line}`);
      }
    }
  }
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    variants: { type: 'string', default: 'old,new' },
    base: { type: 'string', default: 'HEAD' },
    providers: { type: 'string' },
    only: { type: 'string' },
    reps: { type: 'string', default: '3' },
    set: { type: 'string', multiple: true, default: [] },
    concurrency: { type: 'string', default: '' },
    pause: { type: 'string', default: '' },
    dry: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const [command, target, ...rest] = positionals;

if (values.help || !command) {
  console.log(HELP);
} else if (command === 'run' && KINDS.includes(target)) {
  await run(target, values);
} else if (command === 'show' && target) {
  show(target, rest);
} else if (command === 'apply' && KINDS.includes(target) && rest.length === 1) {
  applyPrompt(target, readPromptFile(rest[0]));
  console.log(`${target}: prompt written to ${providersOf(target).length} plugins`);
} else {
  fail(HELP);
}
