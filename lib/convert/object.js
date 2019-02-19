function convertObject (collection, version, callback) {
  const converter = require(`../converter/postman-${version}`)
  converter.convert(collection, callback)
}

module.exports = convertObject
