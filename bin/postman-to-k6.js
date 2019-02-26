#!/usr/bin/env node

const convertFile = require('../lib/convert/file')
const fs = require('fs')
const program = require('commander')

// describe the options and usage instruction for the `convert` command
program
  .version(require('../package.json').version)
  .usage('<filePath> [options]')
  .description('Convert a Postman collection to k6 script')
  .option(
    '-j --input-version <version>',
    'Input version. Options `2.0.0` or `1.0.0`. Default `2.0.0`.', /^(2\.0\.0|1\.0\.0)$/,
    '2.0.0'
  )
  .option(
    '-o --output <path>',
    'Output file path. If not specified writes to stdout.'
  )
  .action(run)
  .parse(process.argv)

function run (...args) {
  if (args.length <= 1) {
    console.error('Provide path to Postman collection')
    return
  }
  const options = args.pop()
  const path = args.shift()

  // Convert
  const version = options.inputVersion
  let result
  try {
    result = convertFile(path, version)
  } catch (e) {
    console.error(e.message)
    console.log(e)
    return
  }

  // Output
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
