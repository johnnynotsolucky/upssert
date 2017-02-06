'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _falsy = require('falsy');

var _falsy2 = _interopRequireDefault(_falsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// trimBrackets :: String -> String
var trimBrackets = (0, _ramda.replace)(/\[|\]/g, '');

// bracketNotation :: Object -> String -> [String]
var bracketNotation = function bracketNotation(a) {
  return (0, _ramda.concat)((0, _ramda.match)(/[^[]*/, a), (0, _ramda.match)(/\[.*?\]/g, a));
};

// dotNotation :: String -> [String]
var dotNotation = (0, _ramda.split)('.');

// propsFromKey :: String -> [String]
var propsFromKey = (0, _ramda.compose)((0, _ramda.map)(trimBrackets), _ramda.flatten, (0, _ramda.map)(bracketNotation), dotNotation);

var getObjectValue = (0, _ramda.curry)(function (obj, key) {
  return (0, _falsy2.default)(key) ? obj : (0, _ramda.path)(propsFromKey(key), obj);
});

exports.default = getObjectValue;