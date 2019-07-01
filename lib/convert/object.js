const Collection = require('../generate/Collection')
const detectVersion = require('./version')
const Environment = require('../generate/Environment')
const Globals = require('../generate/Globals')
const postman = require('postman-collection')
const render = require('../render')
const transformer = require('postman-collection-transformer')
const util = require('../util')

async function convertObject (collection, options = {}) {
  const version = detectVersion(collection)
  if (version[0] === '1') {
    collection = await upgrade(collection)
  }
  const node = new postman.Collection(collection)
  const result = util.makeResult()
  result.setting.id = options.id
  if (options.oauth1) {
    result.setting.oauth1 = options.oauth1
  }
  if (options.iterations) {
    result.iterations = options.iterations
  }
  if (options.csv) {
    result.data.path = `./data.csv`
  } else if (options.json) {
    result.data.path = `./data.json`
  }
  result.data.type = (options.csv ? 'csv' : options.json ? 'json' : null)
  if (result.data.type === 'csv') {
    result.imports.set('papaparse', './libs/papaparse.js')
  }
  Collection(node, result)
  if (options.globals) {
    Globals(options.globals, result)
  }
  if (options.environment) {
    Environment(options.environment, result)
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
