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
  let { requestUrl, apiToken, extraBody } = config;

  requestUrl = normalizeUrl(requestUrl);

  apiToken = apiToken?.trim();
  if (!apiToken) {
    throw 'API Token is required';
  }
  extraBody = parseExtraBody(extraBody);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `token ${apiToken}`,
  };

  const defaultBody = {
    file: base64,
    fileType: 1,
    useLayoutDetection: false,
    useChartRecognition: false,
    promptLabel: 'ocr',
    temperature: 0.0,
    relevelTitles: false,
    visualize: false,
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

  const outputText = res.data.result?.layoutParsingResults?.[0]?.markdown?.text?.trim();
  if (!outputText) {
    throw 'No text returned';
  }

  return outputText;
}
