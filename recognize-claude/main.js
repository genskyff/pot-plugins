function normalizeUrl(requestUrl) {
  let normalizedUrl =
    requestUrl?.trim() || 'https://api.anthropic.com/v1/messages';

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

  const defaultModels = 'claude-sonnet-4-6';
  model = model?.trim() || defaultModels;
  if (model === 'custom') {
    model = customModel?.trim() || defaultModels;
  }

  customPrompt =
    customPrompt?.trim() ||
    'Perform OCR on this screenshot and return only the extracted text.';

  const headers = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'x-api-key': apiKey,
  };

  const body = {
    system:
      'You are an OCR transcription engine. Extract text from screenshots accurately and output only the recognized text. Preserve reading order and formatting as much as possible. Do not explain, translate, summarize, correct, or add content.',
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
    max_tokens: 4096,
    ...(model.toLocaleLowerCase().includes('haiku')
      ? {}
      : {
          thinking: {
            type: 'adaptive',
          },
          output_config: {
            effort: 'low',
          },
        }),
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

  const outputText = res.data.content
    ?.find((item) => item.type === 'text')
    ?.text?.trim();
  if (!outputText) {
    throw 'No text returned';
  }

  return outputText;
}
