'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printMenu = undefined;

var _ramda = require('ramda');

var _functionalUtils = require('../lib/util/functional-utils');

// helpText :: String -> Maybe String
var helpText = function helpText(s) {
  var text = '\n  ' + s + '\n\n  Usage: upssert [options...] [glob]\n\n  Default glob searches in tests/api/**/*.js\n\n  upssert -r tap --url https://httpbin.org/get\n  upssert tests/api/**/*.json\n\n  options:\n    --url           Ping supplied URL\n    --reporter, -r  Set test reporter (tap, console)\n    --help,     -h  Show help\n    --version\n  ';
  return (0, _functionalUtils.booleanMaybe)(text);
};

// versionText :: String -> Maybe String
var versionText = function versionText(s) {
  return (0, _functionalUtils.booleanMaybe)(s);
};

// helpOption :: Object
var helpOption = (0, _ramda.path)(['args', 'help']);

// helpOutput :: Object -> String -> Object -> Maybe String
var helpOutput = function helpOutput(args, description) {
  return (0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(args), helpText(description), helpOption);
};

// versionOption :: Object
var versionOption = (0, _ramda.path)(['args', 'version']);

// versionOutput :: Object -> String -> Object -> Maybe String
var versionOutput = function versionOutput(args, version) {
  return (0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(args), versionText(version), versionOption);
};

// logAndExit :: a -> IO a
var logAndExit = (0, _ramda.compose)((0, _ramda.chain)((0, _functionalUtils.exit)(0)), _functionalUtils.log);

// printMenu :: Object -> IO
var printMenu = (0, _ramda.curry)(function (_ref, args) {
  var description = _ref.description,
      version = _ref.version;

  var f = (0, _ramda.compose)(_functionalUtils.fold, (0, _functionalUtils.bimap)(logAndExit, _functionalUtils.emptyIO), (0, _ramda.chain)(helpOutput(args, description)), versionOutput(args, version));
  return f(args);
});

exports.printMenu = printMenu;