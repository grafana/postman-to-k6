const deconflict = require('./deconflict')
const filenamify = require('filenamify')

function designate (name, container, generators, suffix = '') {
  const normalized = normalize(name)
  const deconflicted = deconflict(
    normalized,
    container,
    generators,
    suffix
  )
  const compiled = deconflicted + suffix
  return compiled
}

function normalize (name) {
  return encode(name)
}

function encode (name) {
  return filenamify(name)
}

module.exports = designate
