'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chai = require('chai');

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assertProperty = function assertProperty(object, property, key) {
  var value = property[key];
  var assertion = (0, _camelcase2.default)(key);
  if (!_chai.assert[assertion]) {
    throw new Error(key + ' is not a valid assertion');
  }
  _chai.assert[assertion](object, value);
};

exports.default = assertProperty;