'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = undefined;

var _ramda = require('ramda');

var _json = require('./util/json');

var _functionalUtils = require('./util/functional-utils');

// defaultConfig :: Object
var defaultConfig = function defaultConfig() {
  return {
    globOpts: [],
    pattern: process.cwd() + '/test/api/**/*.json',
    envPrefix: false
  };
};

// readConfig :: String -> String
var readConfig = function readConfig(file) {
  return (0, _json.readJsonFile)(process.cwd() + '/' + file);
};

// readRuncom :: Either String
var readRuncom = function readRuncom() {
  var read = (0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(null), readConfig);
  return read('.upssertrc');
};

// readClientPackage :: Either String
var readClientPackage = function readClientPackage() {
  var read = (0, _ramda.compose)((0, _functionalUtils.inverseMaybeEither)(null), readConfig);
  return read('package.json').bimap((0, _ramda.propOr)(null, 'upssert'), _ramda.F);
};

// mergeConfigs :: Object -> Object
var mergeConfigs = (0, _ramda.merge)(defaultConfig());

// getConfig :: Object
var getConfig = (0, _ramda.compose)(_functionalUtils.value, (0, _functionalUtils.bimap)(mergeConfigs, mergeConfigs), (0, _ramda.chain)(readClientPackage), readRuncom);

exports.getConfig = getConfig;