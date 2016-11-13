#!/usr/bin/env node

const optionDefinitions = {
  boolean: ['help', 'h'],
};

const minimist = require('minimist');

import optParser from './optionParser';
import events from '../data/events.json';

let argv;
try {
argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log('Hmmm...');
  process.exit(1);
}

const opts = optParser(argv);

import pack from '../package.json';
import Upssert from '../';
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

const data = [];

if (opts.help) {
  showHelp();
} else if (opts.version) {
  console.log(pack.version);
  process.exit(0);
} else if (opts.files || opts.dirs || opts.globPattern) {
  if(opts.files) {
    opts.files.forEach((file) => {
      data.push(require(`${process.cwd()}/${file}`));
    });
  }
}

const upssert = new Upssert();
upssert.on(events.FAIL, () => { process.exitCode = 1; });
upssert.execute(data);

// upssert(opts.target, opts.options, opts.headers, opts.data, opts.formInputs).then(
//   (results) => reporter(results, opts)
// ).catch(console.error);