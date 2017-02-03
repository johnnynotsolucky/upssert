'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToUnitFormat = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _functionalUtils = require('./functional-utils');

var hours = (0, _ramda.always)(3600000);
var minutes = (0, _ramda.always)(60000);
var seconds = (0, _ramda.always)(1000);
var milliseconds = (0, _ramda.always)(1);

// formatTime :: String -> Integer -> Number -> String
var formatTimeUnit = function formatTimeUnit(t, p) {
  return (0, _ramda.compose)((0, _functionalUtils.prependStr)(t), (0, _functionalUtils.toDecimalPrecision)(p));
};

// millisTo :: Integer -> Integer -> Integer
var millisTo = function millisTo(d) {
  return function (ms) {
    return ms / d;
  };
};

// maybeApply :: (String -> Integer -> Number -> String) -> Either String Number
var eitherFormat = function eitherFormat(f) {
  return function (m) {
    return m.isRight ? _ramdaFantasy.Either.Left(f(m.value)) : _ramdaFantasy.Either.Right(m.value);
  };
};

// maybeApply :: (Number -> Number) -> Either Number
var eitherApply = function eitherApply(f) {
  return function (x) {
    var applied = f(x);
    return (0, _ramda.gte)(applied, 1) ? _ramdaFantasy.Either.Right(applied) : _ramdaFantasy.Either.Left(x);
  };
};

// convertTimeUnit :: ((Number -> Number) -> Either Number) -> ((Number -> String) -> Either Number
var convertTimeUnit = function convertTimeUnit(apply, format) {
  return (0, _ramda.compose)(eitherFormat(format), eitherApply(apply));
};

// mapToUnitFormat :: Integer -> Either String
var mapToUnitFormat = (0, _ramda.compose)((0, _ramda.chain)(convertTimeUnit(millisTo(milliseconds()), formatTimeUnit('ms', 0))), (0, _ramda.chain)(convertTimeUnit(millisTo(seconds()), formatTimeUnit('s', 3))), (0, _ramda.chain)(convertTimeUnit(millisTo(minutes()), formatTimeUnit('m', 3))), convertTimeUnit(millisTo(hours()), formatTimeUnit('h', 3)));

exports.mapToUnitFormat = mapToUnitFormat;