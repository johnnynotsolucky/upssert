'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cryptoString = exports.charCodeToString = exports.entityToHex = exports.toDecimalPrecision = exports.prependStr = exports.appendStr = exports.inverseJoinStr = exports.joinStr = exports.inverseEither = exports.either = exports.arrayOrDefault = exports.flatMap = exports.getOrElse = exports.trace = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// trace :: String -> a -> a
var trace = (0, _ramda.curry)(function (tag, x) {
  console.log(tag, x);
  return x;
});

// getOrElse :: a -> Maybe -> b
var getOrElse = (0, _ramda.curry)(function (x, m) {
  return m.getOrElse(x);
});

// flatMap :: (a -> [b]) -> [c]
var flatMap = (0, _ramda.curry)(function (f) {
  return (0, _ramda.compose)(_ramda.flatten, (0, _ramda.map)(f));
});

// identityOrDefault :: [a] -> a -> [a]
var arrayOrDefault = (0, _ramda.curry)(function (args, x) {
  return args.length ? args : [x];
});

// either :: a -> Boolean -> Either a
var either = (0, _ramda.curry)(function (a, x) {
  return x ? _ramdaFantasy.Either.Right(a) : _ramdaFantasy.Either.Left(a);
});

// inverseEither :: a -> Boolean -> Either a
var inverseEither = (0, _ramda.curry)(function (a, x) {
  return x ? _ramdaFantasy.Either.Left(a) : _ramdaFantasy.Either.Right(a);
});

// joinStr :: String -> String -> String -> String
var joinStr = (0, _ramda.curry)(function (joinWith, a, b) {
  return '' + a + joinWith + b;
});

// inverseJoinStr :: String -> String -> String -> String
var inverseJoinStr = (0, _ramda.curry)(function (joinWith, a, b) {
  return joinStr(joinWith, b, a);
});

// appendStr :: String -> String -> String
var appendStr = joinStr('');

// prependStr :: String -> String -> String
var prependStr = inverseJoinStr('');

// toDecimalPrecision :: Integer -> Number -> String
var toDecimalPrecision = (0, _ramda.curry)(function (p, d) {
  return '' + d.toFixed(p);
});

// entityToHex :: String -> String
var entityToHex = (0, _ramda.compose)((0, _ramda.replace)(/;/, ''), (0, _ramda.replace)(/&#/, '0'));

// charCodeToString :: String -> String
var charCodeToString = String.fromCharCode;

// cryptoString :: Integer -> String -> String
var cryptoString = (0, _ramda.curry)(function (bytes, to) {
  return _crypto2.default.randomBytes(bytes).toString(to);
});

exports.trace = trace;
exports.getOrElse = getOrElse;
exports.flatMap = flatMap;
exports.arrayOrDefault = arrayOrDefault;
exports.either = either;
exports.inverseEither = inverseEither;
exports.joinStr = joinStr;
exports.inverseJoinStr = inverseJoinStr;
exports.appendStr = appendStr;
exports.prependStr = prependStr;
exports.toDecimalPrecision = toDecimalPrecision;
exports.entityToHex = entityToHex;
exports.charCodeToString = charCodeToString;
exports.cryptoString = cryptoString;