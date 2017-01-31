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
var mapToPath = function mapToPath(baseDir) {
  return function (p) {
    return !p.startsWith('/') ? baseDir + '/' + p : p;
  };
};

// pathToPattern :: Object -> String -> String
var pathToPattern = function pathToPattern(globOptions) {
  return function (p) {
    return !_glob2.default.hasMagic(p, globOptions) ? _fs2.default.statSync(p).isDirectory() ? p + '/**/*.json' : p : p;
  };
};

// globFiles :: Object -> String -> [String]
var globFiles = function globFiles(globOptions) {
  return function (p) {
    return _glob2.default.sync(p, globOptions);
  };
};

// byPattern :: String, Object -> String -> [String]
var byPattern = function byPattern(cwd, globOptions) {
  return _ramda2.default.compose(globFiles(globOptions), pathToPattern(globOptions), mapToPath(cwd));
};

var trace = function trace(tag) {
  return function (x) {
    console.log(tag, x);
    return x;
  };
};

// mapFiles :: (String -> [String]) -> [String]
var mapFiles = function mapFiles(f) {
  return function (patterns) {
    var patternsToFiles = _ramda2.default.compose(_ramda2.default.flatten, _ramda2.default.map(f));
    return patternsToFiles(patterns);
  };
};

// patternsFromArgs :: [String], String -> [String]
var patternsFromArgs = function patternsFromArgs(args, fallback) {
  return args.length ? args : [fallback];
};

exports.default = function (argv, config) {
  var byAbsolutePattern = byPattern(process.cwd(), config.globOptions);
  var globber = mapFiles(byAbsolutePattern);
  return _extends({}, paramsFromArgs(argv), {
    files: globber(patternsFromArgs(argv._, config.testDir))
  });
};