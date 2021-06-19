const { ParseError } = require('../error');
const convertObject = require('./object');
const stripJsonComments = require('strip-json-comments');

async function convertJson(collectionJson, options = {}) {
  let collection;
  try {
    collection = JSON.parse(stripJsonComments(collectionJson));
  } catch (e) {
    throw new ParseError(e, 'Failed to parse collection JSON');
  }
  if (options.globals) {
    try {
      options.globals = JSON.parse(stripJsonComments(options.globals));
    } catch (e) {
      throw new ParseError(e, 'Failed to parse globals JSON');
    }
  }
  if (options.environment) {
    try {
      options.environment = JSON.parse(stripJsonComments(options.environment));
    } catch (e) {
      throw new ParseError(e, 'Failed to parse environment JSON');
    }
  }
  if (options.k6Params) {
    try {
      options.k6Params = JSON.parse(stripJsonComments(options.k6Params));
    } catch (e) {
      throw new ParseError(e, 'Failed to parse k6 Params JSON');
    }
  }
  return convertObject(collection, options);
}

module.exports = convertJson;
