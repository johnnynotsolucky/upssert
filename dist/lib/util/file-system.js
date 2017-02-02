'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFile = exports.isDirectory = exports.fsIsDirectory = exports.fsStat = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fsStat :: String -> Maybe Object
var fsStat = (0, _ramda.compose)(_ramdaFantasy.Maybe, (0, _ramda.tryCatch)(_fs2.default.statSync, function () {
  return null;
}));

// fsIsDirectory :: Maybe Object -> Maybe Boolean
var fsIsDirectory = function fsIsDirectory(m) {
  return m.isNothing ? (0, _ramdaFantasy.Identity)(false) : m.chain(function (x) {
    return (0, _ramdaFantasy.Identity)(x.isDirectory());
  });
};

// isDirectory :: String -> Identity Boolean
var isDirectory = (0, _ramda.compose)(fsIsDirectory, fsStat);

// readFile :: String -> Maybe String
var readFile = (0, _ramda.compose)(_ramdaFantasy.Maybe, (0, _ramda.tryCatch)(_fs2.default.readFileSync, function () {
  return null;
}));

exports.fsStat = fsStat;
exports.fsIsDirectory = fsIsDirectory;
exports.isDirectory = isDirectory;
exports.readFile = readFile;