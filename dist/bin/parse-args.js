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

// paramsFromArgs :: String -> a -> b
var paramsFromArgs = function paramsFromArgs(reporter) {
  return function (argv) {
    return {
      help: argv.help || argv.h,
      version: argv.version,
      url: argv.url,
      reporter: argv.reporter || argv.r || 'console'
    };
  };
};

// mapToPath :: String -> String -> String
var mapToPath = _ramda2.default.curry(function (baseDir, p) {
  return !p.startsWith('/') ? baseDir + '/' + p : p;
});

// pathToPattern :: Object -> String -> String
var pathToPattern = _ramda2.default.curry(function (globOptions, p) {
  return !_glob2.default.hasMagic(p, globOptions) ? _fs2.default.statSync(p).isDirectory() ? p + '/**/*.json' : p : p;
});

// globFiles :: Object -> String -> [String]
var globFiles = _ramda2.default.curry(function (globOptions, p) {
  return _glob2.default.sync(p, globOptions);
});

// byPattern :: String -> Object -> String -> [String]
var byPattern = _ramda2.default.curry(function (cwd, globOptions) {
  return _ramda2.default.compose(globFiles(globOptions), pathToPattern(globOptions), mapToPath(cwd));
});

// mapFiles :: (String -> [String]) -> [String]
var mapFiles = function mapFiles(f) {
  return function (patterns) {
    var patternsToFiles = _ramda2.default.compose(_ramda2.default.flatten, _ramda2.default.map(f));
    return patternsToFiles(patterns);
  };
};

// patternsFromArgs :: [String] -> String -> [String]
var patternsFromArgs = _ramda2.default.curry(function (args, fallback) {
  return args.length ? args : [fallback];
});

exports.default = function (argv, config) {
  var byAbsolutePattern = byPattern(process.cwd(), config.globOptions);
  var globber = mapFiles(byAbsolutePattern);
  return _extends({}, paramsFromArgs(argv), {
    files: globber(patternsFromArgs(argv._, config.testDir))
  });
};