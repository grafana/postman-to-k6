const convertObject = require('./object')
const stripJsonComments = require('strip-json-comments')

function convertJson (collectionJson, version, callback) {
  let collection
  try {
    collection = JSON.parse(stripJsonComments(collectionJson))
  } catch (e) {
    callback(e)
    return
  }
  convertObject(collection, version, callback)
}

module.exports = convertJson
