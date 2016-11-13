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
  process.exit(0);
}

opts.files.forEach((file) => {
  data.push(require(file));
});

const upssert = new Upssert();
upssert.on(events.FAIL, () => { process.exitCode = 1; });
upssert.execute(data);
