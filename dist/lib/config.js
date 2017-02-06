'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = undefined;

var _ramda = require('ramda');

var _json = require('./util/json');

var _functionalUtils = require('./util/functional-utils');

// defaultConfig :: Object
var defaultConfig = function defaultConfig(proc) {
  return {
    globOpts: [],
    pattern: proc.cwd() + '/test/api/**/*.json',
    envPrefix: false
  };
};

// readConfig :: String -> Either Object
var readConfig = (0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(null), _json.readJsonFile);

// readRuncom :: Object -> Either Object
var readRuncom = function readRuncom(proc) {
  return function () {
    return readConfig(proc.cwd() + '/.upssertrc');
  };
};

// readClientPackage :: Object -> Either Object
var readClientPackage = function readClientPackage(proc) {
  return function () {
    return readConfig(proc.cwd() + '/package.json').bimap((0, _ramda.propOr)(null, 'upssert'), _ramda.F);
  };
};

// getConfig :: Object -> Object
var getConfig = function getConfig(proc) {
  var defaultConf = defaultConfig(proc);
  var mergeConfig = (0, _ramda.merge)(defaultConf);
  var f = (0, _ramda.compose)(_functionalUtils.fold, (0, _functionalUtils.bimap)(mergeConfig, mergeConfig), (0, _ramda.chain)(readClientPackage(proc)), readRuncom(proc));
  return f();
};

exports.getConfig = getConfig;