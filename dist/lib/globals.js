'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globals = function globals() {
  var env = {};
  if (_config2.default.envPrefix) {
    Object.keys(process.env).filter(function (key) {
      return key.indexOf(_config2.default.envPrefix) === 0;
    }).forEach(function (key) {
      env[key] = process.env[key];
    });
  } else {
    env = _extends({}, process.env);
  }
  return {
    env: env
  };
};

exports.default = globals();