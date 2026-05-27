function normalizeUrl(requestUrl) {
  let normalizedUrl = requestUrl?.trim() || 'https://api.anthropic.com/v1/messages';

  const HTTP_PROTOCOL_RE = /^https?:\/\//i;
  const LOCALHOST_RE = /^localhost(?::\d+)?$/i;
  const LOCAL_IP_RE = /^127(?:\.\d{1,3}){3}(?::\d+)?$/;

  if (!HTTP_PROTOCOL_RE.test(normalizedUrl)) {
    const host = normalizedUrl.split(/[/?#]/)[0];

    const isLocalhost = LOCALHOST_RE.test(host) || LOCAL_IP_RE.test(host);

    normalizedUrl = `${isLocalhost ? 'http' : 'https'}://${normalizedUrl}`;
  }

  return normalizedUrl.replace(/\/+$/, '');
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target, ...sources) {
  const result = { ...target };

  for (const source of sources) {
    if (!isPlainObject(source)) {
      continue;
    }

    for (const [key, value] of Object.entries(source)) {
      if (value === null) {
        delete result[key];
      } else if (isPlainObject(value) && isPlainObject(result[key])) {
        result[key] = deepMerge(result[key], value);
      } else if (isPlainObject(value)) {
        result[key] = deepMerge({}, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

function parseExtraBody(value) {
  const text = value?.trim();
  if (!text) {
    return {};
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw `Invalid custom request body JSON: ${error.message}`;
  }

  if (!isPlainObject(parsed)) {
    throw 'Invalid custom request body JSON: must be a JSON object';
  }

  return parsed;
}

// biome-ignore lint/correctness/noUnusedVariables: _
async function recognize(base64, _lang, options) {
  const {
    config,
    utils: { tauriFetch: fetch },
  } = options;
  let { requestUrl, apiKey, model, customModel, customPrompt, extraBody } = config;

  requestUrl = normalizeUrl(requestUrl);

  apiKey = apiKey?.trim();
  if (!apiKey) {
    throw 'API key is required';
  }

  const DEFAULT_MODEL = 'claude-sonnet-4-6';
  model = model?.trim() || DEFAULT_MODEL;
  if (model === 'custom') {
    model = customModel?.trim() || DEFAULT_MODEL;
  }

  customPrompt = customPrompt?.trim() || 'OCR this image.';
  extraBody = parseExtraBody(extraBody);

  const headers = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'X-Api-Key': apiKey,
  };

  const defaultBody = {
    system: `You are a strict OCR transcription engine.

Task:
Transcribe all visible text from the provided image.

Output rules:
- Return only the extracted plain text.
- Do not explain, comment, translate, summarize, correct, rewrite, or add anything.
- Do not wrap the output in Markdown, code fences, labels, quotation marks, or any extra formatting.
- Do not add labels such as "OCR result:" or "Extracted text:".
- If no text is visible, return an empty string.

Accuracy rules:
- Transcribe exactly what is visible.
- Preserve typos, unusual spacing, punctuation, symbols, numbers, capitalization, and mixed languages.
- Do not infer, guess, complete, normalize, or autocorrect text.
- For unreadable characters or words, use [?].
- For partially readable text, keep readable characters and replace only unreadable parts with [?].

Formatting rules:
- Preserve the natural visual reading order as much as possible.
- For multi-column layouts, transcribe each column top to bottom, left to right, unless the visual reading order clearly indicates otherwise.
- Preserve line breaks, paragraph breaks, and indentation.
- Preserve meaningful spacing between elements, such as label-value pairs and aligned columns.
- For tables, forms, receipts, invoices, menus, or lists, preserve row and column alignment using spaces or tabs where possible.
- For code, logs, or terminal output, preserve indentation and line breaks exactly.
- Include all visible text: UI elements, watermarks, headers, footers, timestamps, usernames, prices, units, captions, buttons, icons with text, and labels.`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: customPrompt,
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: base64,
            },
          },
        ],
      },
    ],
    model,
    max_tokens: 8192,
    thinking: {
      type: 'disabled',
    },
  };

  const body = deepMerge(defaultBody, extraBody);

  const res = await fetch(requestUrl, {
    method: 'POST',
    url: requestUrl,
    headers,
    body: {
      type: 'Json',
      payload: body,
    },
  });

  if (!res.ok) {
    throw `Http Status: ${res.status}\n${JSON.stringify(res.data)}`;
  }

  const outputText = res.data.content?.find((item) => item.type === 'text')?.text?.trim();
  if (!outputText) {
    throw 'No text returned';
  }

  return outputText;
}
