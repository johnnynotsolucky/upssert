#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _readJsonFile = require('../lib/read-json-file');

var _readJsonFile2 = _interopRequireDefault(_readJsonFile);

var _parseArgs = require('./parse-args');

var _parseArgs2 = _interopRequireDefault(_parseArgs);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _config = require('../lib/config');

var _config2 = _interopRequireDefault(_config);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-console */
// eslint-disable-line import/no-unresolved


var optionDefinitions = {
  boolean: ['help', 'h']
};

var minimist = require('minimist');

var argv = void 0;
try {
  argv = minimist(process.argv.slice(2), optionDefinitions);
} catch (err) {
  console.log(err);
  process.exit(1);
}

var config = new _config2.default();
var globOptions = config.globOptions,
    defaultPattern = config.testDir;

var opts = (0, _parseArgs2.default)(argv, { globOptions: globOptions, defaultPattern: defaultPattern });

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
  config: config
});

var execute = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var results;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return upssert.execute();

          case 2:
            results = _context.sent;

            if (!results.pass) {
              process.exitCode = 1;
            }

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function execute() {
    return _ref.apply(this, arguments);
  };
}();
execute();