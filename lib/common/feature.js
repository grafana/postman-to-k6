function detectFeature(logic, result) {
  if (/require\(['"]cheerio['"]\)/.test(logic)) {
    let cheerioPath = './libs/shim/cheerio.js';
    if (result.setting && result.setting.separate && result.setting.separate === true) {
      cheerioPath = '../../libs/shim/cheerio.js'
    }
    // cheerio
    result.polyfills.add('spo-gpo');
    result.effectImports.add(cheerioPath);
  }
  if (/require\(['"]crypto-js['"]\)/.test(logic)) {
    let cryptoPath = './libs/shim/crypto-js.js';
    if (result.setting && result.setting.separate && result.setting.separate === true) {
      cryptoPath = '../../libs/shim/crypto-js.js'
    }
    // crypto-js
    result.effectImports.add(cryptoPath);
  }
  if (/require\(['"]lodash['"]\)/.test(logic)) {
    let lodashPath = './libs/shim/lodash.js';
    if (result.setting && result.setting.separate && result.setting.separate === true) {
      lodashPath = '../../libs/shim/lodash.js'
    }
    // lodash
    result.effectImports.add(lodashPath);
  }
  if (/pm\.expect\(/.test(logic)) {
    let expectPath = './libs/shim/expect.js';
    if (result.setting && result.setting.separate && result.setting.separate === true) {
      expectPath = '../../libs/shim/expect.js'
    }
    // pm.expect()
    result.effectImports.add(expectPath);
  }
  if (/pm\.response\.to\.(not\.)?have\.jsonSchema/.test(logic)) {
    let jsonSchemaPath = './libs/shim/jsonSchema.js';
    if (result.setting && result.setting.separate && result.setting.separate === true) {
      jsonSchemaPath = '../../libs/shim/jsonSchema.js'
    }
    // jsonSchema assertion
    result.effectImports.add(jsonSchemaPath);
  }
  if (/xml2Json/.test(logic)) {
    let xml2JsonPath = './libs/shim/xml2Json.js';
    if (result.setting && result.setting.separate && result.setting.separate === true) {
      xml2JsonPath = '../../libs/shim/xml2Json.js'
    }
    // xml2Json()
    result.polyfills.add('spo-gpo');
    result.effectImports.add(xml2JsonPath);
  }
}

module.exports = detectFeature;
