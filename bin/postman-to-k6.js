#!/usr/bin/env node

const convertFile = require('../lib/convert/file');
const fs = require('fs-extra');
const outputRequests = require('./requests');
const path = require('path');
const program = require('commander');
const pkginfo = require('pkginfo');

pkginfo(module, 'version');
const version = module.exports.version;
delete module.exports.version;

program
  .version(version)
  .usage('<path> [options]')
  .description('Convert a Postman collection to k6 script')
  .option('-o, --output <path>', 'Output file path. Default stdout.')
  .option('-i, --iterations <count>', 'Number of iterations.')
  .option('-g, --global <path>', 'JSON export of global variables.')
  .option('-e, --environment <path>', 'JSON export of environment.')
  .option('--cli-options-file <path>','postman-to-k6 CLI options file. Useful for CI/CD integrations.')
  .option('-c, --csv <path>', 'CSV data file. Used to fill data variables.')
  .option('-j, --json <path>', 'JSON data file. Used to fill data variables.')
  .option('--k6-params <path>','K6 param options config file. Sets K6 params used during HTTP requests.')
  .option('--skip-pre', 'Skips pre-request scripts')
  .option('--skip-post', 'Skips post-request scripts')
  .option('--oauth1-consumer-key <value>', 'OAuth1 consumer key.')
  .option('--oauth1-consumer-secret <value>', 'OAuth1 consumer secret.')
  .option('--oauth1-access-token <value>', 'OAuth1 access token.')
  .option('--oauth1-token-secret <value>', 'OAuth1 token secret.')
  .option(
    '--oauth1-signature-method <value>',
    'OAuth1 signature method. One of HMAC-SHA1 HMAC-SHA256 PLAINTEXT.'
  )
  .option('--oauth1-timestamp <value>', 'OAuth1 timestamp.')
  .option('--oauth1-nonce <value>', 'OAuth1 nonce.')
  .option('--oauth1-version <value>', 'OAuth1 version.')
  .option('--oauth1-realm <value>', 'OAuth1 realm.')
  .option('-s, --separate', 'Generate a separate file for each request.')
  .option('--k6-handle-summary-json <path>','Output the K6 handle summary as a JSON file.')
  .action(run)
  .parse(process.argv);

async function run(...args) {
  if (args.length <= 1) {
    console.error('Provide path to Postman collection');
    return;
  }

  let options = args.pop();
  const input = args.shift();

  let cliOptions = {};
  if (options.cliOptionsFile) {
    try {
      const cliOptionsFilePath = path.resolve(options.cliOptionsFile);
      cliOptions = JSON.parse(await fs.readFile(cliOptionsFilePath, 'utf8'));
    } catch (err) {
      console.error(
        '\x1b[31m',
        `postman-to-k6 CLI options error - no such file or directory "${options.cliOptionsFile}"`
      );
      process.exit(1);
    }
  }

  // Merge CLI configuration file with CLI parameters
  options = Object.assign({}, cliOptions, options);

  // Convert
  let main, requests;
  try {
    [main, requests] = await convertFile(input, translateOptions(options));
  } catch (e) {
    console.error(e.message);
    return;
  }

  // Output
  const dir = options.output ? path.dirname(options.output) : '.';
  fs.ensureDirSync(`${dir}/libs`);
  fs.emptyDirSync(`${dir}/libs`);
  fs.copySync(path.resolve(`${__dirname}/../vendor`), `${dir}/libs`);
  fs.copySync(path.resolve(`${__dirname}/../lib/shim`), `${dir}/libs/shim`);
  if (options.csv) {
    fs.copySync(options.csv, `${dir}/data.csv`);
  } else if (options.json) {
    fs.copySync(options.json, `${dir}/data.json`);
  }
  if (options.separate) {
    try {
      outputRequests(dir, requests);
    } catch (error) {
      console.error('could not create request files');
      console.error(error);
      return;
    }
  }
  if (options.output) {
    try {
      fs.writeFileSync(options.output, main);
    } catch (error) {
      console.error('could not create output ' + options.output);
      console.error(error);
    }
  } else {
    console.log(main);
  }
}

function translateOptions(options) {
  return {
    globals: options.global,
    environment: options.environment,
    csv: !!options.csv,
    json: !!options.json,
    k6Params: options.k6Params,
    iterations: options.iterations,
    id: true,
    oauth1: translateOauth1Options(options),
    separate: !!options.separate,
    skip: {
      pre: options.skipPre,
      post: options.skipPost,
    },
    k6HandleSummary: {
      json: options.k6HandleSummaryJson,
    },
  };
}

function translateOauth1Options(options) {
  return {
    consumerKey: options.oauth1ConsumerKey,
    consumerSecret: options.oauth1ConsumerSecret,
    accessToken: options.oauth1AccessToken,
    tokenSecret: options.oauth1TokenSecret,
    signatureMethod: options.oauth1SignatureMethod,
    timestamp: options.oauth1Timestamp,
    nonce: options.oauth1Nonce,
    version: options.oauth1Version,
    realm: options.oauth1Realm,
  };
}
