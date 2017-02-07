'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

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

// schemas :: [a]
var schemas = function schemas() {
  return [['formdata-schema', _formdata2.default], ['request-schema', _request2.default], ['test-schema', _test2.default]];
};

// XXX tv4 makes things difficult
// TODO Look for alternative?

// addSchema :: a
var addSchema = function addSchema(x) {
  return _tv2.default.addSchema(x[0], x[1]);
}; // XXX Impure: Mutates tv4 object

// useSchemas ::
var useSchemas = (0, _ramda.compose)((0, _ramda.map)(addSchema), schemas);

// validateAgainstSchema :: Object -> Object -> Boolean
var validateAgainstSchema = (0, _ramda.curry)(function (s, x) {
  return _tv2.default.validate(x, s);
}); // Impure: validate mutates tv4 object

// isValid :: Boolean -> Boolean|String
var isValid = function isValid(x) {
  return x ? true : _tv2.default.error;
}; // XXX Impure

// validateSuite :: Object -> Boolean|String
var validateSuite = function validateSuite(suite) {
  useSchemas();
  var validate = (0, _ramda.compose)(isValid, validateAgainstSchema(_suite2.default));
  return validate(suite);
};

exports.default = validateSuite;