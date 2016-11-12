#!/usr/bin/env node
'use strict';

var _optionParser = require('./optionParser');

var _optionParser2 = _interopRequireDefault(_optionParser);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionDefinitions = {
  boolean: ['help', 'h']
};

var minimist = require('minimist');

var argv = void 0;
try {
  argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log('Hmmm...');
  process.exit(1);
}

var opts = (0, _optionParser2.default)(argv);

// import reporter from '../lib/reporter';

var showHelp = function showHelp() {
  console.log('\n    ' + _package2.default.description + '\n    Usage: upssert [options...]\n    options:\n      -f, --file File to be tested\n      -d, --dir Directory to load\n      -g, --glob Glob pattern\n      -v, --verbose Verbose output\n      -h, --help Show help\n      --version\n  ');
  process.exit(0);
};

if (opts.help) {
  showHelp();
} else if (opts.version) {
  console.log(_package2.default.version);
  process.exit(0);
}

// upssert(opts.target, opts.options, opts.headers, opts.data, opts.formInputs).then(
//   (results) => reporter(results, opts)
// ).catch(console.error);