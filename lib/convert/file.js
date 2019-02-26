const { ReadError } = require('../error')
const convertJson = require('./json')
const fs = require('fs')

function convertFile (path, version) {
  let text
  try {
    text = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    throw new ReadError(e, 'Could not read input file')
  }
  return convertJson(text, version)
}

module.exports = convertFile
