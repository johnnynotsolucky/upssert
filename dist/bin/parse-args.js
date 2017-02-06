'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseArgs = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _globber = require('../lib/util/globber');

var _functionalUtils = require('../lib/util/functional-utils');

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

var argsToObject = function argsToObject(proc) {
  return (0, _minimist2.default)(proc.argv.slice(2));
};

var cwd = function cwd(proc) {
  return proc.cwd();
};

// parseArgs :: Object -> Object -> Object -> Object
var parseArgs = function parseArgs(proc, _ref) {
  var globOptions = _ref.globOptions,
      pattern = _ref.pattern;

  var args = argsToObject(proc);
  var globByAbsolutePattern = (0, _globber.globByPattern)(cwd(proc), globOptions, '**/*.json');
  var globber = (0, _functionalUtils.flatMap)(globByAbsolutePattern);
  return _extends({}, paramsFromArgs(args), {
    files: globber((0, _functionalUtils.arrayOrDefault)(args._, pattern))
  });
};

exports.parseArgs = parseArgs;