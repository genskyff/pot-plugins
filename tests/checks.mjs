// A check returns true, a string starting with "soft:" (acceptable but not ideal), or a failure reason.

export const all =
  (...tests) =>
  (out) => {
    for (const test of tests) {
      const result = test(out);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };

export const has =
  (...parts) =>
  (out) => {
    const missing = parts.filter((part) => !out.includes(part));
    return missing.length === 0 || `missing ${missing.join(' | ')}`;
  };

export const lacks =
  (...parts) =>
  (out) => {
    const found = parts.filter((part) => out.includes(part));
    return found.length === 0 || `contains ${found.join(' | ')}`;
  };

export const matches =
  (re, label = re) =>
  (out) =>
    re.test(out) || `expected ${label}`;

export const rejects =
  (re, label = re) =>
  (out) =>
    !re.test(out) || `unexpected ${label}`;

export const same = (text) => (out) => out === text || 'changed';

export const maxLength = (n) => (out) =>
  [...out].length <= n || `too long (${[...out].length} chars)`;

export const lineCount = (n) => (out) =>
  out.split('\n').length === n || `${out.split('\n').length} lines`;

export const soft = (test) => (out) => {
  const result = test(out);
  return result === true || `soft: ${result}`;
};

// Full-width punctuation is drawn with its own padding, so a space next to it is not a misreading.
export const textLines = (out) =>
  out
    .split('\n')
    .map((line) =>
      line
        .replace(/[ \t　]+/g, ' ')
        .replace(/ ?([：，（）]) ?/g, '$1')
        .trim(),
    )
    .filter(Boolean);

// Compares non-empty lines; a string must equal the line, a RegExp must match it.
export const lines =
  (...expected) =>
  (out) => {
    const actual = textLines(out);
    if (actual.length !== expected.length) {
      return `${actual.length} lines, expected ${expected.length}`;
    }
    const index = actual.findIndex((line, i) =>
      typeof expected[i] === 'string' ? line !== expected[i] : !expected[i].test(line),
    );
    return index === -1 || `line ${index + 1}: ${actual[index]}`;
  };
