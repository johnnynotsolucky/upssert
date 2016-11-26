'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _falsy = require('falsy');

var _falsy2 = _interopRequireDefault(_falsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Test = function () {
  function Test(test) {
    _classCallCheck(this, Test);

    Object.assign(this, test);
    this.assertions = [];
    var responseSet = !(0, _falsy2.default)(this.response);
    this.addAssertionsIfReponseIsSet(responseSet);
    this.addDefaultPingAssertions(responseSet);
  }

  _createClass(Test, [{
    key: 'addAssertionsIfReponseIsSet',
    value: function addAssertionsIfReponseIsSet(responseSet) {
      var _this = this;

      if (responseSet) {
        Object.keys(this.response).forEach(function (key) {
          var assertion = _this.response[key];
          _this.addEqualAssertionIfString(assertion, key);
          _this.addAssertionsIfObject(assertion, key);
        });
      }
    }
  }, {
    key: 'addEqualAssertionIfString',
    value: function addEqualAssertionIfString(assertion, key) {
      if (typeof assertion === 'string') {
        this.assertions.push(_defineProperty({}, key, {
          equal: assertion
        }));
      }
    }
  }, {
    key: 'addAssertionsIfObject',
    value: function addAssertionsIfObject(assertion, key) {
      if ((typeof assertion === 'undefined' ? 'undefined' : _typeof(assertion)) === 'object') {
        this.assertions.push(_defineProperty({}, key, assertion));
      }
    }
  }, {
    key: 'addDefaultPingAssertions',
    value: function addDefaultPingAssertions(responseSet) {
      if (!responseSet) {
        this.assertions.push({
          statusCode: {
            isAtLeast: 200,
            isBelow: 400
          }
        });
      }
    }
  }]);

  return Test;
}();

exports.default = Test;