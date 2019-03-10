const Collection = require('../generate/Collection')
const detectVersion = require('./version')
const Environment = require('../generate/Environment')
const Globals = require('../generate/Globals')
const postman = require('postman-collection')
const render = require('../render')
const util = require('../util')

function convertObject (collection, { globals, environment, csv, json } = {}) {
  const version = detectVersion(collection)
  switch (version) {
    case '2.0.0':
      break
    default:
      throw new Error(`Unsupported Postman file format version: ${version}`)
  }
  const node = new postman.Collection(collection)
  const result = util.makeResult({ csv, json })
  Collection(node, result)
  if (globals) {
    Globals(globals, result)
  }
  if (environment) {
    Environment(environment, result)
  }
  return render(result)
}

module.exports = convertObject
