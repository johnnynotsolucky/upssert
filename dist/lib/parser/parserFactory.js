'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonParser = require('./jsonParser');

var _jsonParser2 = _interopRequireDefault(_jsonParser);

var _contentTypes = require('../../data/content-types.json');

var _contentTypes2 = _interopRequireDefault(_contentTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (contentType) {
  switch (contentType) {
    case _contentTypes2.default.JSON:
      return _jsonParser2.default;
    default:
      return function (data) {
        return data;
      };
  }
};