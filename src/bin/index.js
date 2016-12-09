#!/usr/bin/env node
/* eslint-disable no-console*/
import 'babel-polyfill';
import readJsonFile from '../lib/read-json-file';
import optParser from './option-parser';
import pack from '../package.json'; // eslint-disable-line import/no-unresolved
import Config from '../lib/config';
import Upssert, { TapReporter, ConsoleReporter, LogWriter } from '../';

const optionDefinitions = {
  boolean: ['help', 'h'],
};

const minimist = require('minimist');

let argv;
try {
  argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log(err);
  process.exit(1);
}

const opts = optParser(argv);

const showHelp = () => {
  console.log(`
    ${pack.description}

    Usage: upssert [options...] [glob]

    Default glob searches in tests/api/**/*.js

    upssert -r tap --url https://httpbin.org/get
    upssert tests/api/**/*.json

    options:
      --url           Ping supplied URL
      --reporter, -r  Set test reporter (tap, console)
      --help,     -h  Show help
      --version
  `);
  process.exit(0);
};

let data;

if (opts.url) {
  data = opts.url;
} else {
  data = [];
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

let reporter;
switch (opts.reporter) {
  case 'tap':
    reporter = new TapReporter();
    break;
  case 'console':
  default:
    reporter = new ConsoleReporter();
}
reporter.setWriter(new LogWriter());
const upssert = new Upssert({
  suites: data,
  reporter,
  config: new Config(),
});

const execute = async () => {
  const results = await upssert.execute();
  if (!results.pass) {
    process.exitCode = 1;
  }
};
execute();
