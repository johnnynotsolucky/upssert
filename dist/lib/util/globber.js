'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globByPattern = exports.pathToPattern = exports.mapToPath = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fileSystem = require('./file-system');

var _functionalUtils = require('./functional-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mapToPath :: String -> String -> String
var mapToPath = (0, _ramda.curry)(function (dir, p) {
  return !p.startsWith('/') ? (0, _functionalUtils.joinStr)('/', dir, p) : p;
});

// isGlobPattern :: Object -> String -> Identity Boolean
var isGlobPattern = (0, _ramda.curry)(function (globOptions, p) {
  return (0, _ramdaFantasy.Identity)(_glob2.default.hasMagic(p, globOptions));
});

// pathToPattern :: Object -> String -> String -> String
var pathToPattern = (0, _ramda.curry)(function (globOptions, postfix, p) {
  return isGlobPattern(globOptions, p).chain((0, _functionalUtils.inverseEither)(p)).chain(_fileSystem.isDirectory).chain((0, _functionalUtils.either)(p)).map((0, _functionalUtils.inverseJoinStr)('/', postfix));
});

// globFiles :: Object -> Either String -> [String]
var globFiles = (0, _ramda.curry)(function (globOptions, p) {
  return _glob2.default.sync(p.value, globOptions);
});

// byPattern :: String -> Object -> String -> [String]
var globByPattern = (0, _ramda.curry)(function (dir, globOptions, postfix) {
  return (0, _ramda.compose)(globFiles(globOptions), pathToPattern(globOptions, postfix), mapToPath(dir));
});

exports.mapToPath = mapToPath;
exports.pathToPattern = pathToPattern;
exports.globByPattern = globByPattern;