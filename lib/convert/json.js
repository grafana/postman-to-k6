const { ParseError } = require('../error')
const convertObject = require('./object')
const stripJsonComments = require('strip-json-comments')

function convertJson (collectionJson, version, callback) {
  let collection
  try {
    collection = JSON.parse(stripJsonComments(collectionJson))
  } catch (e) {
    const error = new ParseError(e, 'Failed to parse JSON')
    callback(error)
    return
  }
  convertObject(collection, version, callback)
}

module.exports = convertJson
