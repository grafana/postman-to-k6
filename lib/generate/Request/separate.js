const analyze = require('./analyze')
const id = require('./id')
const renderConfig = require('./config')

function separate (name, request, result, block) {
  const feature = analyze(request, result, block)
  const config = renderConfig(name, id(result), feature, result)
  block.main.push(`postman[Symbol.for("define")](${config});`)
}

module.exports = separate
