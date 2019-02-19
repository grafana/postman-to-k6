const convertJson = require('./json')
const fs = require('fs')

function convertFile (path, version, callback) {
  let text
  try {
    text = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    callback(e)
    return
  }
  convertJson(text, version, callback)
}

module.exports = convertFile
