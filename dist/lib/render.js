'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (view, model) {
  var result = void 0;
  if (view) {
    try {
      result = _mustache2.default.render(view, model);
    } catch (err) {
      result = false;
    }
  }
  return result;
};