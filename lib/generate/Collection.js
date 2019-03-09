const ListMember = require('./ListMember')
const util = require('../util')
const { readAuth } = require('../common')

const maxRedirects = 4

function Collection (collection, result) {
  const members = util.spread(collection.items)
  if (!members.length) {
    return
  }
  result.options.maxRedirects = maxRedirects
  vars(collection, result)
  readAuth(collection.auth, result.auths, false)
  for (const member of members) {
    ListMember(member, result, result)
  }
}

function vars (collection, result) {
  const scope = result.scope.collection
  const variables = util.spread(collection.variables)
  for (const variable of variables) {
    const name = variable.key
    const spec = varSpec(variable)
    scope.set(name, spec)
  }
}

function varSpec (variable) {
  return {
    value: variable.get(),
    type: util.variableType(variable)
  }
}

module.exports = Collection
