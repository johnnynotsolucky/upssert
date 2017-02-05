#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _functionalUtils = require('../lib/util/functional-utils');

var _json = require('../lib/util/json');

var _parseArgs = require('./parse-args');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _config = require('../lib/config');

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-console */
// eslint-disable-line import/no-unresolved


var config = (0, _config.getConfig)();
var opts = (0, _parseArgs.parseArgs)(config);

var helpText = function helpText(p) {
  return '\n  ' + p.description + '\n\n  Usage: upssert [options...] [glob]\n\n  Default glob searches in tests/api/**/*.js\n\n  upssert -r tap --url https://httpbin.org/get\n  upssert tests/api/**/*.json\n\n  options:\n    --url           Ping supplied URL\n    --reporter, -r  Set test reporter (tap, console)\n    --help,     -h  Show help\n    --version\n  ';
};

var versionText = function versionText(p) {
  return p.version;
};

var state = function state(conf) {
  return {
    args: (0, _parseArgs.parseArgs)(conf),
    conf: conf
  };
};

var setup = (0, _ramda.compose)(state, _config.getConfig);

var showHelp = function showHelp(x) {
  return x ? (0, _ramdaFantasy.Maybe)(helpText(_package2.default)) : _ramdaFantasy.Maybe.Nothing();
};

var showVersion = function showVersion(x) {
  return x ? (0, _ramdaFantasy.Maybe)(versionText(_package2.default)) : _ramdaFantasy.Maybe.Nothing();
};

var print = function print(x) {
  console.log(x);
  return x;
};

var exit = function exit(code) {
  return function () {
    return process.exit(code);
  };
};

var printOutput = function printOutput(args) {
  var f = (0, _ramda.compose)((0, _functionalUtils.bimap)(exit(0), _ramda.identity), (0, _functionalUtils.bimap)(print, _ramda.identity), (0, _ramda.chain)((0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(args), showVersion, (0, _ramda.prop)('version'))), (0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(args), showHelp, (0, _ramda.prop)('help')));
  f(args);
};

printOutput(setup().args);

var data = void 0;
if (opts.url) {
  data = opts.url;
} else {
  data = [];
  opts.files.forEach(function (file) {
    var json = (0, _json.readJsonFile)(file).value;
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