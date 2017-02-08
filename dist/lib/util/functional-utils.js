'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.exit = exports.emptyIO = exports.bimap = exports.cryptoString = exports.charCodeToString = exports.entityToHex = exports.toDecimalPrecision = exports.prependStr = exports.appendStr = exports.inverseJoinStr = exports.joinStr = exports.inverseMaybeEither = exports.inverseEither = exports.either = exports.booleanMaybe = exports.identityOrDefault = exports.arrayOrDefault = exports.flatMap = exports.getOrElse = exports.fold = exports.trace = undefined;

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

// value :: a -> b
var fold = function fold(x) {
  return x.value;
};

// getOrElse :: a -> Maybe -> b
var getOrElse = (0, _ramda.curry)(function (x, m) {
  return m.getOrElse(x);
});

// flatMap :: (a -> [b]) -> [c]
var flatMap = (0, _ramda.curry)(function (f) {
  return (0, _ramda.compose)(_ramda.flatten, (0, _ramda.map)(f));
});

// arrayOrDefault :: [a] -> [a] -> [a]
var arrayOrDefault = (0, _ramda.curry)(function (args, x) {
  return args.length ? args : x;
});

// identityOrDefault :: a -> b -> c
var identityOrDefault = (0, _ramda.curry)(function (b, a) {
  return a || b;
});

// booleanMaybe :: a -> b -> Maybe a
var booleanMaybe = (0, _ramda.curry)(function (a, x) {
  return x ? (0, _ramdaFantasy.Maybe)(a) : _ramdaFantasy.Maybe.Nothing();
});

// either :: a -> Boolean -> Either a
var either = (0, _ramda.curry)(function (a, x) {
  return x ? _ramdaFantasy.Either.Right(a) : _ramdaFantasy.Either.Left(a);
});

// inverseEither :: a -> Boolean -> Either a
var inverseEither = (0, _ramda.curry)(function (a, x) {
  return x ? _ramdaFantasy.Either.Left(a) : _ramdaFantasy.Either.Right(a);
});

// inverseMaybeEither :: Maybe a -> Either Null a
var inverseMaybeEither = (0, _ramda.curry)(function (x, m) {
  return m.isNothing ? _ramdaFantasy.Either.Right(x) : _ramdaFantasy.Either.Left(m.value);
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

// bimap :: (a -> b) -> (a -> b) -> Bifunctor -> Bifunctor
var bimap = (0, _ramda.curry)(function (f, g, x) {
  return x.bimap(f, g);
});

// emptyIO :: IO True
var emptyIO = function emptyIO() {
  return (0, _ramdaFantasy.IO)(_ramda.T);
};

// exit :: Integer -> IO
var exit = function exit(code) {
  return function () {
    return (0, _ramdaFantasy.IO)(function () {
      return process.exit(code);
    });
  };
};

// log :: a -> IO a
var log = function log(x) {
  return (0, _ramdaFantasy.IO)(function () {
    console.log(x);
    return x;
  });
};

exports.trace = trace;
exports.fold = fold;
exports.getOrElse = getOrElse;
exports.flatMap = flatMap;
exports.arrayOrDefault = arrayOrDefault;
exports.identityOrDefault = identityOrDefault;
exports.booleanMaybe = booleanMaybe;
exports.either = either;
exports.inverseEither = inverseEither;
exports.inverseMaybeEither = inverseMaybeEither;
exports.joinStr = joinStr;
exports.inverseJoinStr = inverseJoinStr;
exports.appendStr = appendStr;
exports.prependStr = prependStr;
exports.toDecimalPrecision = toDecimalPrecision;
exports.entityToHex = entityToHex;
exports.charCodeToString = charCodeToString;
exports.cryptoString = cryptoString;
exports.bimap = bimap;
exports.emptyIO = emptyIO;
exports.exit = exit;
exports.log = log;