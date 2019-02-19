const detectVersion = require('./version')

function convertObject (collection, version = detectVersion(collection)) {
  const converter = require(`../converter/${version}`)
  return converter.convert(collection)
}

module.exports = convertObject
