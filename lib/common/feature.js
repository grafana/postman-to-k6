function detectFeature (logic, result) {
  if (/require\(['"]cheerio['"]\)/.test(logic)) {
    // cheerio
    result.polyfills.add('spo-gpo')
    result.effectImports.add('./libs/shim/cheerio.js')
  }
  if (/require\(['"]crypto-js['"]\)/.test(logic)) {
    // crypto-js
    result.bundles.add('crypto-js')
    result.effectImports.add('./libs/shim/crypto-js.js')
  }
  if (/require\(['"]lodash['"]\)/.test(logic)) {
    // lodash
    result.bundles.add('lodash')
    result.effectImports.add('./libs/shim/lodash.js')
  }
  if (/pm\.expect\(/.test(logic)) {
    // pm.expect()
    result.bundles.add('chai')
    result.effectImports.add('./libs/shim/expect.js')
  }
  if (/pm\.response\.to\.(not\.)?have\.jsonSchema/.test(logic)) {
    // jsonSchema assertion
    result.bundles.add('ajv')
    result.effectImports.add('./libs/shim/jsonSchema.js')
  }
  if (/xml2Json/.test(logic)) {
    // xml2Json()
    result.polyfills.add('spo-gpo')
    result.effectImports.add('./libs/shim/xml2Json.js')
  }
}

module.exports = detectFeature
