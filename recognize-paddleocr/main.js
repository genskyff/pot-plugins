function normalizeUrl(requestUrl) {
  let normalizedUrl = requestUrl?.trim();
  if (!normalizedUrl) {
    throw 'Request URL is required';
  }

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

async function recognize(base64, _lang, options) {
  const {
    config,
    utils: { tauriFetch: fetch },
  } = options;
  let { requestUrl, apiToken } = config;

  requestUrl = normalizeUrl(requestUrl);

  apiToken = apiToken?.trim();
  if (!apiToken) {
    throw 'API Token is required';
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `token ${apiToken}`,
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

  const outputText = res.data.result?.layoutParsingResults?.[0]?.markdown?.text?.trim();
  if (!outputText) {
    throw 'No text returned';
  }

  return outputText;
}
