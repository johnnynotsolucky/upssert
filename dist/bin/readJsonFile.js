'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (file) {
  var fileContents = _fs2.default.readFileSync(file);
  var jsonContent = JSON.parse(fileContents);
  return jsonContent;
};