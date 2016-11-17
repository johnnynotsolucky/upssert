'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _getValue = require('./get-value');

var _getValue2 = _interopRequireDefault(_getValue);

var _events = require('../../data/events.json');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assertValue = function assertValue(value, assertAgainst, assertionMethodName) {
  var expectedValue = assertAgainst[assertionMethodName];
  var assertionMethod = (0, _camelcase2.default)(assertionMethodName);
  if (!_chai.assert[assertionMethod]) {
    throw new Error(assertionMethodName + ' is not a valid assertion');
  }
  _chai.assert[assertionMethod](value, expectedValue);
};

var AssertObject = function () {
  function AssertObject(object, assertions) {
    _classCallCheck(this, AssertObject);

    this.object = object;
    this.assertions = assertions;
  }

  _createClass(AssertObject, [{
    key: 'assert',
    value: function assert(errorCb) {
      var _this = this;

      var result = void 0;
      try {
        this.assertions.forEach(function (propertyToAssert) {
          return _this.assertProperty(propertyToAssert, errorCb);
        });
        result = true;
      } catch (err) {
        this.emit(_events2.default.SUITE_STEP_FAIL, this.step, err);
        result = false;
      }
      return result;
    }
  }, {
    key: 'assertProperty',
    value: function assertProperty(propertyToAssert, errorCb) {
      var propertyNameToAssert = Object.keys(propertyToAssert)[0];
      var objectValue = (0, _getValue2.default)(this.object, propertyNameToAssert);
      if (objectValue === undefined || objectValue === null) {
        if (typeof errorCb === 'function') {
          errorCb(new Error(propertyNameToAssert + ' is not valid'));
        }
      } else {
        (function () {
          var assertAgainst = propertyToAssert[propertyNameToAssert];
          Object.keys(propertyToAssert[propertyNameToAssert]).forEach(function (assertionMethod) {
            assertValue(objectValue, assertAgainst, assertionMethod);
          });
        })();
      }
    }
  }]);

  return AssertObject;
}();

exports.default = AssertObject;