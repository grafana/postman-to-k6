function detectFeature (logic, result) {
  if (/require\(['"]cheerio['"]\)/.test(logic)) {
    // cheerio
    result.polyfills.add('spo-gpo')
    result.effectImports.add('./libs/shim/cheerio.js')
  }
  if (/require\(['"]crypto-js['"]\)/.test(logic)) {
    // crypto-js
    result.effectImports.add('./libs/shim/crypto-js.js')
  }
  if (/require\(['"]lodash['"]\)/.test(logic)) {
    // lodash
    result.effectImports.add('./libs/shim/lodash.js')
  }
  if (/pm\.expect\(/.test(logic)) {
    // pm.expect()
    result.effectImports.add('./libs/shim/expect.js')
  }
  if (/pm\.response\.to\.(not\.)?have\.jsonSchema/.test(logic)) {
    // jsonSchema assertion
    result.effectImports.add('./libs/shim/jsonSchema.js')
  }
  if (/xml2Json/.test(logic)) {
    // xml2Json()
    result.polyfills.add('spo-gpo')
    result.effectImports.add('./libs/shim/xml2Json.js')
  }
  if (/escape\(/.test(logic)) {
    result.effectImports.add('./libs/shim/escape.js')
  }
}

module.exports = detectFeature
