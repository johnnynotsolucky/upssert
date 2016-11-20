#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _runner = require('../lib/runner');

var _runner2 = _interopRequireDefault(_runner);

var _tap = require('../lib/reporter/tap');

var _tap2 = _interopRequireDefault(_tap);

var _log = require('../lib/writer/log');

var _log2 = _interopRequireDefault(_log);

var _readJsonFile = require('./read-json-file');

var _readJsonFile2 = _interopRequireDefault(_readJsonFile);

var _optionParser = require('./optionParser');

var _optionParser2 = _interopRequireDefault(_optionParser);

var _events = require('../data/events.json');

var _events2 = _interopRequireDefault(_events);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionDefinitions = {
  boolean: ['help', 'h']
}; // eslint-disable-line import/no-unresolved

/* eslint-disable no-console*/


var minimist = require('minimist');

var argv = void 0;
try {
  argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log('Hmmm...');
  process.exit(1);
}

var opts = (0, _optionParser2.default)(argv);

var showHelp = function showHelp() {
  console.log('\n    ' + _package2.default.description + '\n    Usage: upssert [options...]\n    options:\n      -h, --help Show help\n      --version\n  ');
  process.exit(0);
};

var data = [];

if (opts.url) {
  var ping = {
    name: 'Ping',
    steps: [{
      name: opts.url,
      request: {
        url: opts.url,
        method: 'GET'
      }
    }]
  };
  data.push(ping);
} else {
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

var runner = new _runner2.default();
var writer = new _log2.default();
var reporter = new _tap2.default();
var upssert = new _2.default(data, runner, reporter, writer);
upssert.on(_events2.default.FAIL, function () {
  process.exitCode = 1;
});
upssert.execute(data);