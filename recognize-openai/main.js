function normalizeUrl(requestUrl) {
  let normalizedUrl =
    requestUrl?.trim() || 'https://api.openai.com/v1/chat/completions';

  if (!/https?:\/\/.+/.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  if (normalizedUrl.endsWith('/')) {
    normalizedUrl = normalizedUrl.slice(0, -1);
  }

  return normalizedUrl;
}

async function recognize(base64, _lang, options) {
  const {
    config,
    utils: { tauriFetch: fetch },
  } = options;
  let { requestUrl, apiKey, model, customModel, customPrompt } = config;

  requestUrl = normalizeUrl(requestUrl);

  apiKey = apiKey?.trim();
  if (!apiKey) {
    throw 'API key is required';
  }

  const defaultModels = 'gpt-5.4-mini';
  model = model?.trim() || defaultModels;
  if (model === 'custom') {
    model = customModel?.trim() || defaultModels;
  }

  customPrompt =
    customPrompt?.trim() ||
    'Perform OCR on this screenshot and return only the extracted text.';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const body = {
    messages: [
      {
        role: 'system',
        content:
          'You are an OCR transcription engine. Extract text from screenshots accurately and output only the recognized text. Preserve reading order and formatting as much as possible. Do not explain, translate, summarize, correct, or add content.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: customPrompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
    model,
    max_completion_tokens: 4096,
    reasoning_effort: 'none',
    temperature: 0.0,
    verbosity: 'low',
  };

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

  const outputText = res.data.choices?.[0]?.message?.content?.trim();
  if (!outputText) {
    throw 'No text returned';
  }

  return outputText;
}
