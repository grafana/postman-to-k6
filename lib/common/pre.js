const aid = require('../aid');
const detectFeature = require('./feature');

function readPre(node, block, result = block) {
  const events = aid.spread(node.events);
  const pres = events.filter(event => event.listen === 'prerequest');
  const sections = [];

  // Only skip if --skip-pre is set
  if (shouldIncludePre(result)) {
    for (const event of pres) {
      if (event.disabled) {
        continue;
      }
      const exec = event.script.exec;
      if (exec.disabled) {
        continue;
      }
      const logic = exec.join('\n').trim();
      if (!logic) {
        continue;
      }
      sections.push(logic);
    }
  }
  if (sections.length) {
    block.pre = sections.join('\n\n');
    detectFeature(block.pre, result);
  }
}

function shouldIncludePre(result) {
  return !result.setting.skip || !result.setting.skip.pre;
}

module.exports = readPre;
