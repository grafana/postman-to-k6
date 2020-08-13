const { SuffixGenerator } = require('../../../aid');

function deconflict(name, container, generators, suffix = '') {
  const base = name + suffix;
  const generator = getGenerator(generators, base);
  return findUnused(name, suffix, container, generator);
}

function getGenerator(generators, base) {
  if (generators[base]) {
    return generators[base];
  } else {
    const generator = SuffixGenerator();
    generators[base] = generator;
    return generator;
  }
}

function findUnused(name, suffix, container, generator) {
  let result = nextName(name, generator);
  while (container[result + suffix]) {
    result = nextName(name, generator);
  }
  return result;
}

function nextName(name, generator) {
  const term = generator.next().value;
  if (term) {
    return `${name}.${term}`;
  } else {
    return name;
  }
}

module.exports = deconflict;
