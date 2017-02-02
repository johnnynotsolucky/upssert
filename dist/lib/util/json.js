'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readJsonFile = exports.parseJson = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _fileSystem = require('./file-system');

// parseJson :: String -> Maybe Object
var parseJson = (0, _ramda.compose)(_ramdaFantasy.Maybe, (0, _ramda.tryCatch)(JSON.parse, function () {
  return null;
}));

// readJsonFile :: String -> Maybe Object
var readJsonFile = function readJsonFile(file) {
  return (0, _fileSystem.readFile)(file).chain(parseJson);
};

exports.parseJson = parseJson;
exports.readJsonFile = readJsonFile;