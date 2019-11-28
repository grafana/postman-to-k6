const aid = require('../aid')
const detectFeature = require('./feature')

function readPost (node, block, result = block) {
  const events = aid.spread(node.events)
  const posts = events.filter(event => (event.listen === 'test'))
  const sections = []
  for (const event of posts) {
    if (event.disabled) {
      continue
    }
    const exec = event.script.exec
    if (exec.disabled) {
      continue
    }
    const logic = exec.join('\n').trim()
    if (!logic) {
      continue
    }
    sections.push(logic)
  }
  if (sections.length) {
    block.post = sections.join('\n\n')
    detectFeature(block.post, result)
  }
}

module.exports = readPost
