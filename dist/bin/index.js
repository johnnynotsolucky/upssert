#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _readJsonFile = require('../lib/read-json-file');

var _readJsonFile2 = _interopRequireDefault(_readJsonFile);

var _optionParser = require('./option-parser');

var _optionParser2 = _interopRequireDefault(_optionParser);

var _events = require('../data/events.json');

var _events2 = _interopRequireDefault(_events);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _config = require('../lib/config');

var _config2 = _interopRequireDefault(_config);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line import/no-unresolved
var optionDefinitions = {
  boolean: ['help', 'h']
};
/* eslint-disable no-console*/


var minimist = require('minimist');

var argv = void 0;
try {
  argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log(err);
  process.exit(1);
}

var opts = (0, _optionParser2.default)(argv);

var showHelp = function showHelp() {
  console.log('\n    ' + _package2.default.description + '\n\n    Usage: upssert [options...] [glob]\n\n    Default glob searches in tests/api/**/*.js\n\n    upssert -r tap --url https://httpbin.org/get\n    upssert tests/api/**/*.json\n\n    options:\n      --url           Ping supplied URL\n      --reporter, -r  Set test reporter (tap, console)\n      --help,     -h  Show help\n      --version\n  ');
  process.exit(0);
};

var data = void 0;

if (opts.url) {
  data = opts.url;
} else {
  data = [];
  if (opts.help) {
    showHelp();
  } else if (opts.version) {
    console.log(_package2.default.version);
    process.exit(0);
  }

  opts.files.forEach(function (file) {
    var json = (0, _readJsonFile2.default)(file);
    data.push(json);
  });
}

var reporter = void 0;
switch (opts.reporter) {
  case 'tap':
    reporter = new _.TapReporter();
    break;
  case 'console':
  default:
    reporter = new _.ConsoleReporter();
}
reporter.setWriter(new _.LogWriter());
var upssert = new _2.default({
  suites: data,
  reporter: reporter,
  config: new _config2.default()
});
upssert.on(_events2.default.FAIL, function () {
  process.exitCode = 1;
});
upssert.execute();