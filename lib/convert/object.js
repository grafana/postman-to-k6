function convertObject (collection, version, callback) {
  const converter = require(`../converters/postman-${version}`)
  converter.convert(collection, callback)
}

module.exports = convertObject
