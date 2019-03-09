const { ReadError } = require('../error')
const convertJson = require('./json')
const fs = require('fs')

function convertFile (path, { globals } = {}) {
  let text
  const options = {}
  try {
    text = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    throw new ReadError(e, `Could not read input file: ${path}`)
  }
  if (globals) {
    try {
      options.globals = fs.readFileSync(globals, { encoding: 'utf8' })
    } catch (e) {
      throw new ReadError(e, `Could not read globals file: ${globals}`)
    }
  }
  return convertJson(text, options)
}

module.exports = convertFile
