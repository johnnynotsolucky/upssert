'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var hash = _crypto2.default.createHash('sha256');
  hash.update(_crypto2.default.randomBytes(64));
  var digest = hash.digest('hex');
  return digest;
};