'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (view, model) {
  if (view) {
    try {
      return _mustache2.default.render(view, model);
    } catch (err) {
      console.log(err);
    }
  }
};