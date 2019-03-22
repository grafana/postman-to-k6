#!/usr/bin/env node

const fs = require('fs-extra')
const browserify = require('browserify')

const dir = 'vendor'
const modules = [
  'aws4',
  'chai',
  'cheerio',
  'crypto-js',
  'lodash',
  'oauth-1.0a',
  'papaparse',
  'urijs',
  'xml2js'
]

fs.ensureDirSync(dir)
for (const module of modules) {
  const path = `${dir}/${module}.js`
  browserify({ standalone: module })
    .require(module)
    .bundle()
    .pipe(fs.createWriteStream(path))
}
fs.ensureDirSync(`${dir}/shim`)
fs.copySync('lib/shim', `${dir}/shim`)
