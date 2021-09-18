const aid = require('../aid');
const Collection = require('../generate/Collection');
const detectVersion = require('./version');
const Environment = require('../generate/Environment');
const Globals = require('../generate/Globals');
const postman = require('postman-collection');
const render = require('../render');
const separate = require('../generate/separate');
const Handlesummary = require('../generate/HandleSummary');
const transformer = require('postman-collection-transformer');

async function convertObject(collection, options = {}) {
  const version = detectVersion(collection);
  if (version[0] === '1') {
    collection = await upgrade(collection);
  }
  const node = new postman.Collection(collection);
  const result = aid.makeResult();
  result.setting.id = options.id;

  result.setting.skip = getSkipSettings(options);

  if (options.oauth1) {
    result.setting.oauth1 = options.oauth1;
  }
  if (options.k6RequestTagging) {
    result.setting.requestTagging = options.k6RequestTagging;
  }
  result.setting.separate = options.separate;
  if (options.iterations) {
    result.iterations = options.iterations;
  }
  if (options.csv) {
    result.data.path = './data.csv';
  } else if (options.json) {
    result.data.path = './data.json';
  }
  result.data.type = options.csv ? 'csv' : options.json ? 'json' : null;
  if (result.data.type === 'csv') {
    result.imports.set('papaparse', './libs/papaparse.js');
  }
  Collection(node, result);
  if (options.globals) {
    Globals(options.globals, result);
  }
  if (options.environment) {
    Environment(options.environment, result);
  }
  if (options.k6Params) {
    result.options = Object.assign({}, result.options, options.k6Params);
  }
  if (options.separate) {
    separate(node, result);
  }
  if (options.k6HandleSummary) {
    Handlesummary(options.k6HandleSummary, result);
  }
  return render(result);
}

function getSkipSettings(options) {
  return options.skip
    ? {
        pre: options.skip.pre,
        post: options.skip.post,
      }
    : {};
}

const upgradeOptions = {
  inputVersion: '1.0.0',
  outputVersion: '2.1.0',
  retainIds: true,
};

function upgrade(collection) {
  return new Promise((resolve, reject) => {
    transformer.convert(collection, upgradeOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = convertObject;
