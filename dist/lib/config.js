'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _readJsonFile = require('./read-json-file');

var _readJsonFile2 = _interopRequireDefault(_readJsonFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function Config() {
  _classCallCheck(this, Config);

  var config = void 0;
  try {
    var runcom = (0, _readJsonFile2.default)(process.cwd() + '/.upssertrc');
    if (runcom) {
      config = runcom;
    } else {
      var clientPackage = (0, _readJsonFile2.default)(process.cwd() + '/package.json');
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