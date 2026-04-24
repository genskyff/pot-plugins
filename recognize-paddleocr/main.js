function normalizeUrl(requestUrl) {
  let normalizedUrl = requestUrl?.trim();

  if (!normalizedUrl) {
    throw 'Request URL is required';
  }

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
  let { requestUrl, apiKey } = config;

  requestUrl = normalizeUrl(requestUrl);

  apiKey = apiKey?.trim();
  if (!apiKey) {
    throw 'API key is required';
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `token ${apiKey}`,
  };

  const body = {
    file: base64,
    fileType: 1,
    useLayoutDetection: false,
    useChartRecognition: false,
    promptLabel: 'ocr',
    temperature: 0.0,
    relevelTitles: false,
    visualize: false,
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

  const outputText =
    res.data.result?.layoutParsingResults?.[0]?.markdown?.text?.trim();
  if (!outputText) {
    throw 'No text returned';
  }

  return outputText;
}
