const aid = require('../aid');

function Environment(environment, result) {
  vars(environment, result);
}

function vars(environment, result) {
  const scope = result.scope.environment;
  for (const item of environment.values) {
    if (!item.enabled) {
      continue;
    }
    const name = item.key;
    const spec = varSpec(item);
    scope.set(name, spec);
  }
}

function varSpec(item) {
  return {
    value: item.value,
    type: aid.variableType(item.type, item.value),
  };
}

module.exports = Environment;
