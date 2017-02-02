'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maybeValue = exports.maybe = undefined;

var _ramda = require('ramda');

var maybe = (0, _ramda.curry)(function (x, f, m) {
  return f(m.getOrElse(x));
});
var maybeValue = (0, _ramda.curry)(function (x, m) {
  return maybe(x, function (a) {
    return a;
  });
});

exports.maybe = maybe;
exports.maybeValue = maybeValue;