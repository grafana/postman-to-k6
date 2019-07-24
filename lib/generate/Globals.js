const aid = require('../aid')

function Globals (globals, result) {
  vars(globals, result)
}

function vars (globals, result) {
  const scope = result.scope.global
  for (const item of globals.values) {
    if (!item.enabled) {
      continue
    }
    const name = item.key
    const spec = varSpec(item)
    scope.set(name, spec)
  }
}

function varSpec (item) {
  return {
    value: item.value,
    type: aid.variableType(item.type, item.value)
  }
}

module.exports = Globals
