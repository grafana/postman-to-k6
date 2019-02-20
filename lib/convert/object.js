const detectVersion = require('./version')
const Generator = require('../generator')

function convertObject (collection, version = detectVersion(collection)) {
  switch (version) {
    case '2.0.0': break
    default:
      throw new Error(`Unsupported Postman file format version: ${version}`)
  }
  const generator = new Generator()
  return generator.convert(collection)
}

module.exports = convertObject
