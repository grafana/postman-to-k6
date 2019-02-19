const { ParseError } = require('../error')
const convertObject = require('./object')
const stripJsonComments = require('strip-json-comments')

function convertJson (collectionJson, version) {
  let collection
  try {
    collection = JSON.parse(stripJsonComments(collectionJson))
  } catch (e) { throw new ParseError(e, 'Failed to parse JSON') }
  return convertObject(collection, version)
}

module.exports = convertJson