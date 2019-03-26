#!/usr/bin/env node

const convertFile = require('../lib/convert/file')
const fs = require('fs-extra')
const path = require('path')
const program = require('commander')
const pkginfo = require('pkginfo')

pkginfo(module, 'version')
const version = module.exports.version
delete module.exports.version

program
  .version(version)
  .usage('<path> [options]')
  .description('Convert a Postman collection to k6 script')
  .option('-o, --output <path>', 'Output file path. Default stdout.')
  .option('-i, --iterations <count>', 'Number of iterations.')
  .option('-g, --global <path>', 'JSON export of global variables.')
  .option('-e, --environment <path>', 'JSON export of environment.')
  .option('-c, --csv <path>', 'CSV data file. Used to fill data variables.')
  .option('-j, --json <path>', 'JSON data file. Used to fill data variables.')
  .action(run)
  .parse(process.argv)

function run (...args) {
  if (args.length <= 1) {
    console.error('Provide path to Postman collection')
    return
  }
  const options = args.pop()
  const input = args.shift()

  // Convert
  let result
  try {
    result = convertFile(input, {
      globals: options.global,
      environment: options.environment,
      csv: !!options.csv,
      json: !!options.json,
      iterations: options.iterations
    })
  } catch (e) {
    console.error(e.message)
    console.log(e)
    return
  }

  // Output
  const dir = (options.output ? path.dirname(options.output) : '.')
  fs.ensureDirSync(`${dir}/libs`)
  fs.copySync(path.resolve(`${__dirname}/../vendor`), `${dir}/libs`)
  if (options.csv) {
    fs.copySync(options.csv, `${dir}/data.csv`)
  } else if (options.json) {
    fs.copySync(options.json, `${dir}/data.json`)
  }
  if (options.output) {
    fs.writeFile(options.output, result, error => {
      if (error) {
        console.error('could not create output ' + options.output)
        console.error(error)
      }
    })
  } else {
    console.log(result)
  }
}
