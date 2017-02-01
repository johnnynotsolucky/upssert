'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _globber = require('./globber');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// paramsFromArgs :: a -> b
var paramsFromArgs = function paramsFromArgs(args) {
  return {
    help: args.help || args.h,
    version: args.version,
    url: args.url,
    reporter: args.reporter || args.r || 'console'
  };
};

// parseArgs :: Object -> Object -> Object -> Object
exports.default = _ramda2.default.curry(function (args, _ref) {
  var globOptions = _ref.globOptions,
      defaultPattern = _ref.defaultPattern;

  var globByAbsolutePattern = (0, _globber.globByPattern)(_globber.isDirectory, process.cwd(), '**/*.json', globOptions);
  var globber = (0, _globber.mapFiles)(globByAbsolutePattern);
  return _extends({}, paramsFromArgs(args), {
    files: globber((0, _globber.patternsFromArgs)(args._, defaultPattern))
  });
});