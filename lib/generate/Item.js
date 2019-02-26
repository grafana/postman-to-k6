const Request = require('./Request')
const util = require('../util')

function Item (item, result, block) {
  const [ pre, test ] = hooks(item)
  const spec = util.makeGroup()
  Request(item.request, result, spec)
  for (const declare of spec.declares) {
    block.declares.add(declare)
  }
  const chunk = [ ...pre, ...spec.main, ...test ]
  block.main.push(chunk)
}

function hooks (item) {
  const events = util.spread(item.events)
    .filter(event => event.script.exec.length)
  const pre = events.filter(event => (event.listen === 'prerequest'))
  const test = events.filter(event => (event.listen === 'test'))
  return [ logic(pre), logic(test) ]
}

function logic (events) {
  const scripts = events.map(event => event.script.exec.join(`\n`))
  const comments = scripts.map(script => [ `/*`, script, `*/` ].join(`\n`))
  return comments
}

module.exports = Item
