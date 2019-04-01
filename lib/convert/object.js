const Collection = require('../generate/Collection')
const detectVersion = require('./version')
const Environment = require('../generate/Environment')
const Globals = require('../generate/Globals')
const postman = require('postman-collection')
const render = require('../render')
const transformer = require('postman-collection-transformer')
const util = require('../util')

async function convertObject (collection, {
  globals,
  environment,
  csv,
  json,
  iterations,
  id
} = {}) {
  const version = detectVersion(collection)
  if (version[0] === '1') {
    collection = await upgrade(collection)
  }
  const node = new postman.Collection(collection)
  const result = util.makeResult()
  result.setting.id = id
  if (iterations) {
    result.iterations = iterations
  }
  if (csv) {
    result.data.path = `./data.csv`
  } else if (json) {
    result.data.path = `./data.json`
  }
  result.data.type = (csv ? 'csv' : json ? 'json' : null)
  if (result.data.type === 'csv') {
    result.imports.set('papaparse', './libs/papaparse.js')
  }
  Collection(node, result)
  if (globals) {
    Globals(globals, result)
  }
  if (environment) {
    Environment(environment, result)
  }
  return render(result)
}

const upgradeOptions = {
  inputVersion: '1.0.0',
  outputVersion: '2.1.0',
  retainIds: true
}
function upgrade (collection) {
  return new Promise((resolve, reject) => {
    transformer.convert(collection, upgradeOptions, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = convertObject
