const inline = require('./inline')
const reference = require('./reference')

function Request (name, request, result, block) {
  if (result.setting.separate) {
    reference(name, result, block)
  } else {
    inline(name, request, result, block)
  }
}

module.exports = Request
