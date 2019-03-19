function detectFeature (logic, result) {
  if (/require(['"]cheerio['"])/.test(logic)) {
    // cheerio
    result.effectImports.add('./bundle/shim/cheerio.js')
  }
  if (/require(['"]crypto-js['"])/.test(logic)) {
    // crypto-js
    result.effectImports.add('./bundle/shim/crypto-js.js')
  }
  if (/require(['"]lodash['"])/.test(logic)) {
    // lodash
    result.effectImports.add('./bundle/shim/lodash.js')
  }
  if (/pm\.expect\(/.test(logic)) {
    // pm.expect()
    result.effectImports.add('./bundle/shim/expect.js')
  }
  if (/pm\.response\.to\.(not\.)?be\.jsonSchema/.test(logic)) {
    // jsonSchema assertion
    result.effectImports.add('./bundle/shim/jsonSchema.js')
  }
  if (/xml2Json/.test(logic)) {
    // xml2Json()
    result.effectImports.add('./bundle/shim/xml2Json.js')
  }
}

module.exports = detectFeature
