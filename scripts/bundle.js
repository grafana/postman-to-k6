#!/usr/bin/env node

const fs = require('fs-extra');
const browserify = require('browserify');

const dir = 'vendor';
const modules = [
  'ajv',
  'aws4',
  'chai',
  'cheerio',
  'crypto-js',
  'faker',
  'lodash',
  'oauth-1.0a',
  'papaparse',
  'spo-gpo/polyfill',
  'urijs',
  'xml2js'
];

fs.ensureDirSync(dir);
fs.emptyDirSync(dir);
for (const module of modules) {
  const name = module.split('/')[0];
  const path = `${dir}/${name}.js`;
  browserify({ standalone: module })
    .require(module)
    .bundle()
    .pipe(fs.createWriteStream(path));
}
