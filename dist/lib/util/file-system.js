'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirectory = exports.fsIsDirectory = exports.fsStat = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _foldable = require('./foldable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fsStat :: String -> Maybe Object
var fsStat = (0, _ramda.compose)(_ramdaFantasy.Maybe, (0, _ramda.tryCatch)(_fs2.default.statSync, function () {
  return null;
}));

// fsIsDirectory :: Maybe Object -> Maybe Boolean
var fsIsDirectory = function fsIsDirectory(m) {
  return m.map(function (x) {
    return x.isDirectory();
  });
};

// isDirectory :: String -> Boolean
var isDirectory = (0, _ramda.compose)(_foldable.getValue, fsIsDirectory, fsStat);

exports.fsStat = fsStat;
exports.fsIsDirectory = fsIsDirectory;
exports.isDirectory = isDirectory;