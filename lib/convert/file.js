const { ReadError } = require('../error')
const convertJson = require('./json')
const fs = require('fs')

function convertFile (path, version, callback) {
  let text
  try {
    text = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    const error = new ReadError(e, 'Could not read input file')
    callback(error)
    return
  }
  convertJson(text, version, callback)
}

module.exports = convertFile
