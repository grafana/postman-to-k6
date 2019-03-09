const { ParseError } = require('../error')
const convertObject = require('./object')
const stripJsonComments = require('strip-json-comments')

function convertJson (collectionJson, { globals } = {}) {
  let collection
  const options = {}
  try {
    collection = JSON.parse(stripJsonComments(collectionJson))
  } catch (e) {
    throw new ParseError(e, 'Failed to parse collection JSON')
  }
  if (globals) {
    try {
      options.globals = JSON.parse(stripJsonComments(globals))
    } catch (e) {
      throw new ParseError(e, 'Failed to parse globals JSON')
    }
  }
  return convertObject(collection, options)
}

module.exports = convertJson
