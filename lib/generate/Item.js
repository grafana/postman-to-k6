const readPost = require('../common/post')
const readPre = require('../common/pre')
const Request = require('./Request')
const aid = require('../aid')

function Item (item, result, block) {
  const spec = aid.makeGroup({ auths: block.auths })
  readPre(item, spec, result)
  readPost(item, spec, result)
  Request(item.name, item.request, result, spec)
  for (const declare of spec.declares) {
    block.declares.add(declare)
  }
  const chunk = [ ...spec.main ]
  block.main.push(chunk)
}

module.exports = Item
