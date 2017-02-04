'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = undefined;

var _ramda = require('ramda');

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _functionalUtils = require('./functional-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// renderView :: String -> Object -> String
var renderView = (0, _ramda.curry)(function (view, model) {
  return _mustache2.default.render(view, model);
});

// findEscapedEntities :: String -> [String]
var findEscapedEntities = function findEscapedEntities(x) {
  return (0, _ramda.match)(/&#x[a-fA-F0-9][a-fA-F0-9];/g, x) || [];
};

// replaceEntityWithHex :: String -> String -> String
var replaceEntityWithHex = (0, _ramda.curry)(function (s, x) {
  return (0, _ramda.replace)(x, (0, _functionalUtils.charCodeToString)((0, _functionalUtils.entityToHex)(x)), s);
});

// replaceEscapedEntities :: String -> String
var replaceEscapedEntities = function replaceEscapedEntities(str) {
  var replaceWithHex = (0, _ramda.reduce)(replaceEntityWithHex, str);
  return replaceWithHex(findEscapedEntities(str));
};

// render :: String -> Object -> String
var render = function render(view) {
  return (0, _ramda.compose)(replaceEscapedEntities, renderView(view));
};

exports.render = render;