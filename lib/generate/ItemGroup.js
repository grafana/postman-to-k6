const ListMember = require('./ListMember')
const util = require('../util')

function ItemGroup (group, result, block) {
  if (group.auth) {
    throw new Error('ItemGroup auth not supported')
  }
  result.imports.set('group', { base: 'k6' })
  const spec = util.makeGroup({ name: group.name, auths: block.auths })
  block.main.push(spec)
  const members = util.spread(group.items)
  for (const member of members) {
    ListMember(member, result, spec)
  }
}

module.exports = ItemGroup
