function convertObject (collection, version) {
  const converter = require(`../converter/${version}`)
  return converter.convert(collection)
}

module.exports = convertObject
