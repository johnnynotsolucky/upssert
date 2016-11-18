#!/usr/bin/env node
/* eslint-disable no-console*/
import 'babel-polyfill';
import Runner from '../lib/runner';
import TapReporter from '../lib/reporter/tap';
import LogWriter from '../lib/writer/log';
import readJsonFile from './readJsonFile';
import optParser from './optionParser';
import events from '../data/events.json';
import pack from '../package.json'; // eslint-disable-line import/no-unresolved
import Upssert from '../';

const optionDefinitions = {
  boolean: ['help', 'h'],
};

const minimist = require('minimist');

let argv;
try {
  argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log('Hmmm...');
  process.exit(1);
}

const opts = optParser(argv);

const showHelp = () => {
  console.log(`
    ${pack.description}
    Usage: upssert [options...]
    options:
      -h, --help Show help
      --version
  `);
  process.exit(0);
};

const data = [];

if (opts.url) {
  const ping = {
    name: 'Ping',
    steps: [{
      name: opts.url,
      request: {
        url: opts.url,
        method: 'GET',
      },
    }],
  };
  data.push(ping);
} else {
  if (opts.help) {
    showHelp();
  } else if (opts.version) {
    console.log(pack.version);
    process.exit(0);
  }

  opts.files.forEach((file) => {
    const json = readJsonFile(file);
    data.push(json);
  });
}

const runner = new Runner();
const writer = new LogWriter();
const reporter = new TapReporter();
const upssert = new Upssert(data, runner, reporter, writer);
upssert.on(events.FAIL, () => { process.exitCode = 1; });
upssert.execute(data);
