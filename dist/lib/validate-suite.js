'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tv = require('tv4');

var _tv2 = _interopRequireDefault(_tv);

var _formdata = require('../data/schema/formdata.json');

var _formdata2 = _interopRequireDefault(_formdata);

var _request = require('../data/schema/request.json');

var _request2 = _interopRequireDefault(_request);

var _test = require('../data/schema/test.json');

var _test2 = _interopRequireDefault(_test);

var _suite = require('../data/schema/suite.json');

var _suite2 = _interopRequireDefault(_suite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (suite) {
  var result = void 0;
  _tv2.default.addSchema('formdata-schema', _formdata2.default);
  _tv2.default.addSchema('request-schema', _request2.default);
  _tv2.default.addSchema('test-schema', _test2.default);
  var testIsValid = _tv2.default.validate(suite, _suite2.default);
  if (testIsValid) {
    result = true;
  } else {
    result = _tv2.default.error;
  }
  return result;
};