#!/usr/bin/env node

const convertFile = require('../lib/convert/file')
const fs = require('fs')
const program = require('commander')
const version = require('project-version')

// describe the options and usage instruction for the `convert` command
program
  .version(version)
  .usage('<filePath> [options]')
  .description('Convert a Postman collection to k6 script')
  .option('-o --output <path>', 'Output file path. Default stdout.')
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
  let result
  try {
    result = convertFile(path)
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
