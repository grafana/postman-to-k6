const Collection = require('../generate/Collection')
const detectVersion = require('./version')
const postman = require('postman-collection')
const render = require('../render')
const util = require('../util')

function convertObject (collection, version = detectVersion(collection)) {
  switch (version) {
    case '2.0.0':
      break
    default:
      throw new Error(`Unsupported Postman file format version: ${version}`)
  }
  const node = new postman.Collection(collection)
  const result = util.makeResult()
  Collection(node, result)
  return render(result)
}

module.exports = convertObject
