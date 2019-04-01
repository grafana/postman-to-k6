const ListMember = require('./ListMember')
const readPost = require('../common/post')
const readPre = require('../common/pre')
const aid = require('../aid')
const { readAuth } = require('../common')

const maxRedirects = 4

function Collection (collection, result) {
  const members = aid.spread(collection.items)
  if (!members.length) {
    return
  }
  result.options.maxRedirects = maxRedirects
  vars(collection, result)
  scripts(collection, result)
  readAuth(collection.auth, result.auths, false)
  for (const member of members) {
    ListMember(member, result)
  }
}

function vars (collection, result) {
  const scope = result.scope.collection
  const variables = aid.spread(collection.variables)
  for (const variable of variables) {
    const name = variable.key
    const spec = varSpec(variable)
    scope.set(name, spec)
  }
}

function varSpec (variable) {
  return {
    value: variable.get(),
    type: aid.variableType(variable.type, variable.get())
  }
}

function scripts (collection, result) {
  readPre(collection, result)
  if (result.pre) {
    result.symbols.set('Pre', 'pre')
  }
  readPost(collection, result)
  if (result.post) {
    result.symbols.set('Post', 'post')
  }
}

module.exports = Collection
