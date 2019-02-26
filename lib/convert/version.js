const re = /https:\/\/schema.getpostman.com\/json\/collection\/v([^/]+)/

/** Detect version of Postman collection object. */
function detectVersion (collection) {
  if (!('info' in collection)) {
    return '1.0.0'
  } else {
    const schema = collection.info.schema
    if (!schema) {
      throw new Error('Invalid Postman file format')
    }
    const match = schema.match(re)
    if (match.length === 0) {
      throw new Error('Invalid Postman file format')
    }
    return match[1]
  }
}

module.exports = detectVersion
