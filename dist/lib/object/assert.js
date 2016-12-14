'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _getValue = require('./get-value');

var _getValue2 = _interopRequireDefault(_getValue);

var _render = require('../util/render');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssertObject = function () {
  function AssertObject(object, assertions, model, config) {
    _classCallCheck(this, AssertObject);

    this.object = object;
    this.assertions = assertions;
    this.model = model;
    this.unescaped = config && config.unescaped;
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
        if (typeof errorCb === 'function') {
          errorCb(err);
        }
        result = false;
      }
      return result;
    }
  }, {
    key: 'assertProperty',
    value: function assertProperty(propertyToAssert) {
      var _this2 = this;

      var propertyNameToAssert = Object.keys(propertyToAssert)[0];
      var objectValue = (0, _getValue2.default)(this.object, propertyNameToAssert);
      if (objectValue === undefined) {
        throw new Error(propertyNameToAssert + ' is not valid');
      } else {
        (function () {
          var assertAgainst = propertyToAssert[propertyNameToAssert];
          Object.keys(assertAgainst).forEach(function (assertionMethod) {
            try {
              _this2.assertValue(objectValue, assertAgainst, assertionMethod);
            } catch (err) {
              var params = [objectValue, assertAgainst[assertionMethod], propertyNameToAssert, err];
              err.message = _this2.getAssertionMessage.apply(_this2, params);
              throw err;
            }
          });
        })();
      }
    }
  }, {
    key: 'assertValue',
    value: function assertValue(value, assertAgainst, assertionMethodName) {
      var expectedValue = this.getExpectedValue(assertAgainst[assertionMethodName]);
      var assertionMethod = (0, _camelcase2.default)(assertionMethodName);
      if (!_chai.assert[assertionMethod]) {
        var message = void 0;
        if (assertionMethodName.trim().length === 0) {
          message = 'Invalid assertion';
        } else {
          message = assertionMethodName + ' is not a valid assertion';
        }
        throw new Error(message);
      }
      expectedValue = this.renderValue(expectedValue);
      expectedValue = this.createRegExpIfRequired(assertionMethod, expectedValue);
      _chai.assert[assertionMethod](value, expectedValue);
    }
  }, {
    key: 'getExpectedValue',
    value: function getExpectedValue(val) {
      var result = void 0;
      if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
        result = val.value;
      } else {
        result = val;
      }
      return result;
    }
  }, {
    key: 'getAssertionMessage',
    value: function getAssertionMessage(actual, expect, propertyName, err) {
      var result = void 0;
      if ((typeof expect === 'undefined' ? 'undefined' : _typeof(expect)) === 'object') {
        var model = {
          actual: actual,
          expected: expect.value
        };
        result = (0, _render2.default)(expect.message, model);
      } else {
        result = err.message;
      }
      result = result + ' (' + propertyName + ')';
      return result;
    }
  }, {
    key: 'createRegExpIfRequired',
    value: function createRegExpIfRequired(assertionMethod, regexStr) {
      var result = regexStr;
      if (assertionMethod === 'match' || assertionMethod === 'notMatch') {
        result = new RegExp(regexStr);
      }
      return result;
    }
  }, {
    key: 'renderValue',
    value: function renderValue(value) {
      var result = void 0;
      if (typeof value === 'string') {
        result = (0, _render2.default)(value, this.model, this.unescaped);
      } else {
        result = value;
      }
      return result;
    }
  }]);

  return AssertObject;
}();

exports.default = AssertObject;