const util = require('../util')

function readPre (node, block) {
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
    if (exec.length === 1 && exec[0] === '') {
      continue
    }
    sections.push(exec.join(`\n`).trim())
  }
  if (sections.length) {
    block.pre.push(sections.join(`\n\n`))
  }
}

module.exports = readPre
