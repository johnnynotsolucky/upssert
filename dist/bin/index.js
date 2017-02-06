#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _json = require('../lib/util/json');

var _parseArgs = require('./parse-args');

var _menu = require('./menu');

var _config = require('../lib/config');

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-console */


// eslint-disable-line import/no-unresolved

// state :: Object -> Object
var state = function state(proc) {
  var conf = (0, _config.getConfig)(proc);
  var args = (0, _parseArgs.parseArgs)(proc, conf);
  return { args: args, conf: conf };
};

// init :: Object -> IO a
var init = (0, _ramda.compose)(_ramdaFantasy.Identity, state);

init(process).chain((0, _menu.printMenu)(_package2.default)).runIO();

var config = (0, _config.getConfig)(process);
var opts = (0, _parseArgs.parseArgs)(process, config);

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