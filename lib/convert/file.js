const { ReadError } = require('../error')
const convertJson = require('./json')
const fs = require('fs')

function convertFile (path, {
  globals,
  environment,
  csv,
  json,
  iterations
} = {}) {
  let text
  const options = { csv, json, iterations }
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
  if (environment) {
    try {
      options.environment = fs.readFileSync(environment, { encoding: 'utf8' })
    } catch (e) {
      throw new ReadError(e, `Could not read environment file: ${environment}`)
    }
  }
  return convertJson(text, options)
}

module.exports = convertFile
