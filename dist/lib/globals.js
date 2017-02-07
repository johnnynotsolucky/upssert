'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

// prefixOrEmpty :: String -> String
var prefixOrEmpty = function prefixOrEmpty(p) {
  return p || '';
};

// keyWithPrefix :: -> String -> String -> Boolean
var keyWithPrefix = (0, _ramda.curry)(function (p, k) {
  return (0, _ramda.indexOf)(prefixOrEmpty(p), k) === 0;
});

// filterKeysByPrefix -> String -> [String] -> [String]
var filterKeysByPrefix = function filterKeysByPrefix(p) {
  return (0, _ramda.filter)(keyWithPrefix(p));
};

// selectKeys :: String -> Object -> [String]
var selectKeys = function selectKeys(p) {
  return (0, _ramda.compose)(filterKeysByPrefix(p), _ramda.keys);
};

// getGlobals :: String -> Object -> Object
var getGlobals = (0, _ramda.curry)(function (p, a) {
  var select = selectKeys(p);
  return (0, _ramda.pick)(select(a), a);
});

exports.default = getGlobals;