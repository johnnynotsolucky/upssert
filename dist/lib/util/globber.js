'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globByPattern = exports.directoryToPattern = exports.mapToAbsolutePath = undefined;

var _ramda = require('ramda');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fileSystem = require('./file-system');

var _functionalUtils = require('./functional-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mapToPath :: String -> String -> String
var mapToAbsolutePath = (0, _ramda.curry)(function (dir, p) {
  return !p.startsWith('/') ? (0, _functionalUtils.joinStr)('/', dir, p) : p;
});

// pathToPattern :: Object -> String -> String -> String
var directoryToPattern = (0, _ramda.curry)(function (globOptions, postfix, p) {
  return (0, _fileSystem.isDirectory)(p).chain((0, _functionalUtils.either)(p)).map((0, _functionalUtils.inverseJoinStr)('/', postfix));
});

// globFiles :: Object -> Either String -> [String]
var globFiles = (0, _ramda.curry)(function (globOptions, m) {
  return _glob2.default.sync(m.value, globOptions);
});

// byPattern :: String -> Object -> String -> [String]
var globByPattern = (0, _ramda.curry)(function (dir, globOptions, postfix) {
  return (0, _ramda.compose)(globFiles(globOptions), directoryToPattern(globOptions, postfix), mapToAbsolutePath(dir));
});

exports.mapToAbsolutePath = mapToAbsolutePath;
exports.directoryToPattern = directoryToPattern;
exports.globByPattern = globByPattern;