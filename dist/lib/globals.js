"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var envVariables = function envVariables(config) {
  var env = {};
  if (config.envPrefix) {
    Object.keys(process.env).filter(function (key) {
      return key.indexOf(config.envPrefix) === 0;
    }).forEach(function (key) {
      env[key] = process.env[key];
    });
  } else {
    env = _extends({}, process.env);
  }
  return env;
};

exports.default = function (config) {
  var env = envVariables(config);
  return {
    env: env
  };
};