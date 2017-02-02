'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _json = require('./util/json');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function Config() {
  _classCallCheck(this, Config);

  var config = void 0;
  try {
    var runcom = (0, _json.readJsonFile)(process.cwd() + '/.upssertrc').value;
    if (runcom) {
      config = runcom;
    } else {
      var clientPackage = (0, _json.readJsonFile)(process.cwd() + '/package.json').value;
      if (clientPackage && clientPackage.upssert) {
        config = clientPackage.upssert;
      } else {
        config = {};
      }
    }
  } catch (err) {
    config = {};
  }

  this.globOptions = config.globOpts || [];
  this.testDir = config.testDir || process.cwd() + '/test/api/**/*.json';
  this.envPrefix = config.envPrefix || false;
  this.unescaped = config.unescaped || false;
};

exports.default = Config;