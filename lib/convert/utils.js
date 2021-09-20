function isArray(a) {
  return Array.isArray(a);
}

function isObject(o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

function keysToCamel(o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map(i => {
      return keysToCamel(i);
    });
  }

  return o;
}

function toCamel(s) {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

Object.assign(exports, {
  keysToCamel,
  isArray,
  isObject,
  toCamel,
});
