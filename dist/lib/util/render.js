'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (view, model) {
  var rendered = _mustache2.default.render(view, model);
  if (_config2.default.unescape) {
    var escaped = rendered.match(/&#x[a-fA-F0-9][a-fA-F0-9];/g);
    if (escaped) {
      (function () {
        var hexes = escaped.map(function (m) {
          return m.replace(/&#/, '0').replace(/;/, '');
        });
        escaped.forEach(function (match, index) {
          rendered = rendered.replace(match, String.fromCharCode(parseInt(hexes[index], 16)));
        });
      })();
    }
  }
  return rendered;
};