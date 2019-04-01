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
  .option('-s, --separate', 'Generate a separate file for each request')
  .action(run)
  .parse(process.argv)

async function run (...args) {
  if (args.length <= 1) {
    console.error('Provide path to Postman collection')
    return
  }
  const options = args.pop()
  const input = args.shift()

  // Convert
  let main, requests
  try {
    [ main, requests ] = await convertFile(input, {
      globals: options.global,
      environment: options.environment,
      csv: !!options.csv,
      json: !!options.json,
      iterations: options.iterations,
      id: true,
      separate: !!options.separate
    })
  } catch (e) {
    console.error(e.message)
    console.error(e)
    return
  }

  // Output
  const dir = (options.output ? path.dirname(options.output) : '.')
  fs.ensureDirSync(`${dir}/libs`)
  fs.emptyDirSync(`${dir}/libs`)
  fs.copySync(path.resolve(`${__dirname}/../vendor`), `${dir}/libs`)
  fs.copySync(path.resolve(`${__dirname}/../lib/shim`), `${dir}/libs/shim`)
  if (options.csv) {
    fs.copySync(options.csv, `${dir}/data.csv`)
  } else if (options.json) {
    fs.copySync(options.json, `${dir}/data.json`)
  }
  if (options.separate) {
    const success = outputRequests(dir, requests)
    if (!success) {
      return
    }
  }
  if (options.output) {
    try {
      fs.writeFileSync(options.output, main)
    } catch (e) {
      console.error(`Could not create output ${options.output}`)
      console.error(e)
    }
  } else {
    console.log(main)
  }
}

function outputRequests (dir, requests) {
  fs.ensureDirSync(`${dir}/requests`)
  for (const file of Object.keys(requests)) {
    const logic = requests[file]
    try {
      fs.writeFileSync(`${dir}/requests/${file}`, logic)
    } catch (e) {
      console.error(`Could not create request file ${file}`)
      console.error(e)
      return false
    }
  }
  return true
}
