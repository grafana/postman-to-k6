const inline = require('./inline')

function Request (name, request, result, block) {
  inline(name, request, result, block)
}

module.exports = Request
