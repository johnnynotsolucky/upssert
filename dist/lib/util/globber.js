'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patternsFromArgs = exports.mapFiles = exports.globByPattern = exports.globFiles = exports.pathToPattern = exports.isDirectory = exports.mapToPath = undefined;

var _ramda = require('ramda');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fileSystem = require('./file-system');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mapToPath :: String -> String -> String
var mapToPath = (0, _ramda.curry)(function (baseDir, p) {
  return !p.startsWith('/') ? baseDir + '/' + p : p;
});

// pathToPattern :: Object -> String -> String -> String
var pathToPattern = (0, _ramda.curry)(function (globOptions, postfix, p) {
  return !_glob2.default.hasMagic(p, globOptions) ? (0, _fileSystem.isDirectory)(p) ? [p, postfix].join('/') : p : p;
});

// globFiles :: Object -> String -> [String]
var globFiles = (0, _ramda.curry)(function (globOptions, p) {
  return _glob2.default.sync(p, globOptions);
});

// byPattern :: String -> Object -> String -> [String]
var globByPattern = (0, _ramda.curry)(function (dir, globOptions, postfix) {
  return (0, _ramda.compose)(globFiles(globOptions), pathToPattern(globOptions, postfix), mapToPath(dir));
});

// mapFiles :: (String -> [String]) -> [String]
var mapFiles = function mapFiles(f) {
  return function (patterns) {
    var patternsToFiles = (0, _ramda.compose)(_ramda.flatten, (0, _ramda.map)(f));
    return patternsToFiles(patterns);
  };
};

// patternsFromArgs :: [String] -> String -> [String]
var patternsFromArgs = (0, _ramda.curry)(function (args, defaultDir) {
  return args.length ? args : [defaultDir];
});

exports.mapToPath = mapToPath;
exports.isDirectory = _fileSystem.isDirectory;
exports.pathToPattern = pathToPattern;
exports.globFiles = globFiles;
exports.globByPattern = globByPattern;
exports.mapFiles = mapFiles;
exports.patternsFromArgs = patternsFromArgs;