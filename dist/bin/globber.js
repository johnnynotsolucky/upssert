'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patternsFromArgs = exports.mapFiles = exports.globByPattern = exports.globFiles = exports.pathToPattern = exports.isDirectory = exports.mapToPath = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mapToPath :: String -> String -> String
var mapToPath = _ramda2.default.curry(function (baseDir, p) {
  return !p.startsWith('/') ? baseDir + '/' + p : p;
});

// isDirectory :: Object -> String -> Boolean
var isDirectory = _ramda2.default.curry(function (fs, p) {
  return fs.statSync(p).isDirectory();
});

// pathToPattern :: (Object -> String -> Boolean) -> Object -> String -> String -> String
var pathToPattern = _ramda2.default.curry(function (f, globOptions, postfix, p) {
  return !_glob2.default.hasMagic(p, globOptions) ? f(p) ? '' + p + postfix : p : p;
});

// globFiles :: Object -> String -> [String]
var globFiles = _ramda2.default.curry(function (globOptions, p) {
  return _glob2.default.sync(p, globOptions);
});

// byPattern :: (Object -> String -> Boolean) -> String -> Object -> String -> [String]
var globByPattern = _ramda2.default.curry(function (f, cwd, globOptions, postfix) {
  return _ramda2.default.compose(globFiles(globOptions), pathToPattern(f, globOptions, postfix), mapToPath(cwd));
});

// mapFiles :: (String -> [String]) -> [String]
var mapFiles = function mapFiles(f) {
  return function (patterns) {
    var patternsToFiles = _ramda2.default.compose(_ramda2.default.flatten, _ramda2.default.map(f));
    return patternsToFiles(patterns);
  };
};

// patternsFromArgs :: [String] -> String -> [String]
var patternsFromArgs = _ramda2.default.curry(function (args, defaultDir) {
  return args.length ? args : [defaultDir];
});

exports.mapToPath = mapToPath;
exports.isDirectory = isDirectory;
exports.pathToPattern = pathToPattern;
exports.globFiles = globFiles;
exports.globByPattern = globByPattern;
exports.mapFiles = mapFiles;
exports.patternsFromArgs = patternsFromArgs;