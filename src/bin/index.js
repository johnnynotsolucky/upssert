#!/usr/bin/env node

const optionDefinitions = {
  boolean: ['help', 'h'],
};

const minimist = require('minimist');

import optParser from './optionParser';

let argv;
try {
argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log('Hmmm...');
  process.exit(1);
}

const opts = optParser(argv);

import pack from '../package.json';
import upssert from '../';
// import reporter from '../lib/reporter';

const showHelp = () => {
  console.log(`
    ${pack.description}
    Usage: upssert [options...]
    options:
      -f, --file File to be tested
      -d, --dir Directory to load
      -g, --glob Glob pattern
      -v, --verbose Verbose output
      -h, --help Show help
      --version
  `);
  process.exit(0);
};

if (opts.help) {
  showHelp();
} else if (opts.version) {
  console.log(pack.version);
  process.exit(0);
}

// upssert(opts.target, opts.options, opts.headers, opts.data, opts.formInputs).then(
//   (results) => reporter(results, opts)
// ).catch(console.error);