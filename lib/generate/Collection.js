const ListMember = require('./ListMember')
const util = require('../util')

const maxRedirects = 4

function Collection (collection, result) {
  const members = util.spread(collection.items)
  if (!members.length) return
  result.options.maxRedirects = maxRedirects
  for (const member of members) ListMember(member, result, result)
}

module.exports = Collection
