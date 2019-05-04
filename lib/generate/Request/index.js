const analyze = require('./analyze')
const renderConfig = require('./config')
const uuidv4 = require('uuid/v4')

function Request (name, request, result, block) {
  const feature = analyze(request, result, block)
  const id = result.setting.id ? uuidv4() : null
  render(name, id, feature, result, block)
}

function render (name, id, feature, result, block) {
  const config = renderConfig(name, id, feature)
  if (feature.setup.length) {
    block.main.push(feature.setup.join(`\n`))
  }
  block.main.push(`postman[Request](${config})`)
}

module.exports = Request
