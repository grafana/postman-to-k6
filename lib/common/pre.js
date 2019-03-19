const detectFeature = require('./feature')
const util = require('../util')

function readPre (node, block, result = block) {
  const events = util.spread(node.events)
  const pres = events.filter(event => (event.listen === 'prerequest'))
  const sections = []
  for (const event of pres) {
    if (event.disabled) {
      continue
    }
    const exec = event.script.exec
    if (exec.disabled) {
      continue
    }
    const logic = exec.join(`\n`).trim()
    if (!logic) {
      continue
    }
    sections.push(logic)
  }
  if (sections.length) {
    block.pre = sections.join(`\n\n`)
    detectFeature(block.pre, result)
  }
}

module.exports = readPre
