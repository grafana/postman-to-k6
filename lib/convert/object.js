const convert = require('../generator')
const detectVersion = require('./version')

function convertObject (collection, version = detectVersion(collection)) {
  switch (version) {
    case '2.0.0': break
    default:
      throw new Error(`Unsupported Postman file format version: ${version}`)
  }
  return convert(collection)
}

module.exports = convertObject
