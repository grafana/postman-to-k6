const deconflict = require('./deconflict')

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
  return name
    .replace(/[^A-Za-z0-9 -.]/g, '')
    .replace(/ +/g, '-')
}

module.exports = designate
