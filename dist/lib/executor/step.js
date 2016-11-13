'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _httpstat = require('httpstat');

var _httpstat2 = _interopRequireDefault(_httpstat);

var _falsy = require('falsy');

var _falsy2 = _interopRequireDefault(_falsy);

var _chai = require('chai');

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _transposeStatResult = require('./transposeStatResult');

var _transposeStatResult2 = _interopRequireDefault(_transposeStatResult);

var _events2 = require('../../data/events.json');

var _events3 = _interopRequireDefault(_events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Step = function (_EventEmitter) {
  _inherits(Step, _EventEmitter);

  function Step(step) {
    _classCallCheck(this, Step);

    var _this = _possibleConstructorReturn(this, (Step.__proto__ || Object.getPrototypeOf(Step)).call(this));

    _this.step = step;
    _this.assertions = [];
    return _this;
  }

  _createClass(Step, [{
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(previousResults) {
        var data, result, stepPassed;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.emit(_events3.default.SUITE_STEP_START, this.step);
                data = this.extractRequiredData(previousResults);
                _context.next = 4;
                return this.httpRequest();

              case 4:
                result = _context.sent;
                stepPassed = false;

                if (result) {
                  stepPassed = this.assert(result);
                  if (stepPassed) {
                    this.emit(_events3.default.SUITE_STEP_PASS, this.step);
                  }
                }
                this.emit(_events3.default.SUITE_STEP_END, this.step);
                return _context.abrupt('return', {
                  step: this.step,
                  pass: stepPassed,
                  result: result
                });

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute(_x) {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'extractRequiredData',
    value: function extractRequiredData(results) {
      var data = {};
      if (this.step.requires) {
        this.step.requires.forEach(function (id) {
          data[id] = results[id].result;
        });
      }
      return data;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var responseSet = !(0, _falsy2.default)(this.step.response);
      this.addAssertionsIfReponseIsSet(responseSet);
      this.addDefaultPingAssertions(responseSet);
    }
  }, {
    key: 'addAssertionsIfReponseIsSet',
    value: function addAssertionsIfReponseIsSet(responseSet) {
      if (responseSet) {
        for (var key in this.step.response) {
          var assertion = this.step.response[key];
          this.addEqualAssertionIfString(assertion, key);
          this.addAssertionsIfObject(assertion, key);
        }
      }
    }
  }, {
    key: 'addEqualAssertionIfString',
    value: function addEqualAssertionIfString(assertion, key) {
      if (typeof assertion === 'string') {
        this.assertions.push(_defineProperty({}, key, {
          equal: assertion
        }));
        this.emit(_events3.default.SUITE_ASSERTION_COUNT, 1);
      }
    }
  }, {
    key: 'addAssertionsIfObject',
    value: function addAssertionsIfObject(assertion, key) {
      if ((typeof assertion === 'undefined' ? 'undefined' : _typeof(assertion)) === 'object') {
        this.assertions.push(_defineProperty({}, key, assertion));
        this.emit(_events3.default.SUITE_ASSERTION_COUNT, Object.keys(assertion).length);
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
        this.emit(_events3.default.SUITE_ASSERTION_COUNT, 2);
      }
    }
  }, {
    key: 'assert',
    value: function assert(object) {
      var _this2 = this;

      var result = void 0;
      try {
        this.assertions.forEach(function (assertion) {
          _this2.assertObjectProperty(object, assertion);
        });
        result = true;
      } catch (err) {
        this.emit(_events3.default.SUITE_STEP_FAIL, this.step, err);
        result = false;
      }
      return result;
    }
  }, {
    key: 'assertObjectProperty',
    value: function assertObjectProperty(body, assertion) {
      var key = Object.keys(assertion)[0];
      var object = this.getObjectFromKey(body, key);
      if ((0, _falsy2.default)(object)) {
        this.emit(_events3.default.SUITE_STEP_FAIL, this.step, new Error(key + ' is not valid'));
      } else {
        for (var assertionKey in assertion[key]) {
          var property = assertion[key];
          this.assertProperty(object, property, assertionKey);
        };
      }
    }
  }, {
    key: 'getObjectFromKey',
    value: function getObjectFromKey(object, key) {
      var properties = key.split('.');
      properties.forEach(function (property) {
        object = object[(0, _camelcase2.default)(property)];
      });
      return object;
    }
  }, {
    key: 'assertProperty',
    value: function assertProperty(object, property, key) {
      var value = property[key];
      var assertion = (0, _camelcase2.default)(key);
      if (!_chai.assert[assertion]) {
        throw new Error(key + ' is not a valid assertion');
      }
      _chai.assert[assertion](object, value);
    }
  }, {
    key: 'httpRequest',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(previousResult) {
        var result, object;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return (0, _httpstat2.default)(this.step.request.url, {
                  method: this.step.request.method
                });

              case 3:
                result = _context2.sent;

                //TODO use mustache templating and add post data, etc
                object = (0, _transposeStatResult2.default)(result);
                return _context2.abrupt('return', object);

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](0);

                this.emit(_events3.default.SUITE_STEP_FAIL, this.step, _context2.t0);
                return _context2.abrupt('return', false);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 8]]);
      }));

      function httpRequest(_x2) {
        return _ref2.apply(this, arguments);
      }

      return httpRequest;
    }()
  }]);

  return Step;
}(_events.EventEmitter);

exports.default = Step;