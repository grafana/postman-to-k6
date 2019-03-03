const ListMember = require('./ListMember')
const util = require('../util')
const { readAuth } = require('../common')

function ItemGroup (group, result, block) {
  result.imports.set('group', { base: 'k6' })
  const spec = util.makeGroup({ name: group.name, auths: block.auths })
  readAuth(group.auth, spec.auths)
  block.main.push(spec)
  const members = util.spread(group.items)
  for (const member of members) {
    ListMember(member, result, spec)
  }
}

module.exports = ItemGroup
