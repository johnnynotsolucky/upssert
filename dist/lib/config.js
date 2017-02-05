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
    testDir: process.cwd() + '/test/api/**/*.json',
    envPrefix: false
  };
};

// readConfig :: String -> String
var readConfig = function readConfig(file) {
  return (0, _json.readJsonFile)(process.cwd() + '/' + file);
};

// readRuncom :: String
var readRuncom = function readRuncom() {
  var read = (0, _ramda.compose)(_functionalUtils.inverseMaybeEither, readConfig);
  return read('.upssertrc');
};

// readClientPackage :: String
var readClientPackage = function readClientPackage() {
  var read = (0, _ramda.compose)(_functionalUtils.inverseMaybeEither, readConfig);
  return read('package.json').bimap((0, _ramda.propOr)(null, 'upssert'), _ramda.F);
};

// mergeConfigs :: Object -> Object
var mergeConfigs = (0, _ramda.merge)(defaultConfig());

// getConfig :: Object
var getConfig = function getConfig() {
  return readRuncom().chain(readClientPackage).bimap(mergeConfigs, mergeConfigs);
};

exports.getConfig = getConfig;