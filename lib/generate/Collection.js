const ListMember = require('./ListMember')
const util = require('../util')

const maxRedirects = 4

function Collection (collection, result) {
  const members = util.spread(collection.items)
  if (!members.length) return
  result.options.maxRedirects = maxRedirects
  vars(collection, result)
  for (const member of members) ListMember(member, result, result)
}

function vars (collection, result) {
  const variables = util.spread(collection.variables)
  for (const variable of variables) {
    const name = variable.key
    const spec = varSpec(variable)
    result.vars.set(name, spec)
  }
}

function varSpec (variable) {
  return { value: variable.value }
}

module.exports = Collection
