#!/usr/bin/env node
'use strict';

var _readJsonFile = require('./readJsonFile');

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

var upssert = new _2.default();
upssert.on(_events2.default.FAIL, function () {
  process.exitCode = 1;
});
upssert.execute(data);