'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultReporter = function defaultReporter() {
  return 'console';
};
var argvParams = function argvParams(reporter) {
  return function (argv) {
    return {
      help: argv.help || argv.h,
      version: argv.version,
      url: argv.url,
      reporter: argv.reporter || argv.r || reporter
    };
  };
};
var argsWithReporter = argvParams(defaultReporter());

var relativePatternToAbsolutePattern = function relativePatternToAbsolutePattern(baseDir) {
  return function (p) {
    return !p.startsWith('/') ? baseDir + '/' + p : p;
  };
};
var directoryPathToPattern = function directoryPathToPattern(globOptions) {
  return function (p) {
    return !_glob2.default.hasMagic(p, globOptions) ? _fs2.default.statSync(p).isDirectory() ? p + '/**/*.json' : p : p;
  };
};
var globFilesForPattern = function globFilesForPattern(globOptions) {
  return function (p) {
    return _glob2.default.sync(p, globOptions);
  };
};

var globFiles = function globFiles(cwd) {
  return function (globOptions) {
    return function (patterns) {
      var cwdPattern = relativePatternToAbsolutePattern(cwd);
      var dirPatternOpts = directoryPathToPattern(globOptions);
      var globWithOpts = globFilesForPattern(globOptions);
      var globByPattern = _ramda2.default.compose(globWithOpts, dirPatternOpts, cwdPattern);
      var reducer = function reducer(acc, val) {
        return _ramda2.default.concat(acc, globByPattern(val));
      };
      var patternsToFiles = _ramda2.default.reduce(reducer, []);
      return patternsToFiles(patterns);
    };
  };
};

var cwdGlob = globFiles(process.cwd());

exports.default = function (argv, config) {
  var patterns = [].concat(_toConsumableArray(argv._));
  if (patterns.length === 0) {
    patterns.push(config.testDir);
  }

  var globWithOptions = cwdGlob(config.globOptions);

  return _extends({}, argsWithReporter(argv), {
    files: globWithOptions(patterns)
  });
};