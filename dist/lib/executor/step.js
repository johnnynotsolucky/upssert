'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _falsy = require('falsy');

var _falsy2 = _interopRequireDefault(_falsy);

var _assert = require('../object/assert');

var _assert2 = _interopRequireDefault(_assert);

var _generateToken = require('../util/generate-token');

var _generateToken2 = _interopRequireDefault(_generateToken);

var _http = require('../http');

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
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resultset) {
        var _this2 = this;

        var trace, data, httpRequest, response, stat, stepPassed, assertObject;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.emit(_events3.default.SUITE_STEP_START, this.step);
                trace = this.addTraceHeader();
                data = this.extractRequiredData(resultset);
                httpRequest = new _http.HttpRequest(this.step, data);
                _context.next = 6;
                return (0, _http.makeRequest)(httpRequest);

              case 6:
                response = _context.sent;
                stat = (0, _http.httpStat)(response);
                stepPassed = false;

                if (stat) {
                  assertObject = new _assert2.default(stat, this.assertions);

                  stepPassed = assertObject.assert(function (err) {
                    _this2.emit(_events3.default.SUITE_STEP_FAIL, _this2.step, err);
                  });
                  if (stepPassed) {
                    this.emit(_events3.default.SUITE_STEP_PASS, this.step);
                  }
                }
                this.emit(_events3.default.SUITE_STEP_END, this.step);
                return _context.abrupt('return', {
                  trace: trace,
                  step: this.step,
                  pass: stepPassed,
                  result: stat
                });

              case 12:
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
    key: 'addTraceHeader',
    value: function addTraceHeader() {
      if (!this.step.request.headers) {
        this.step.request.headers = {};
      }
      var token = (0, _generateToken2.default)();
      this.step.request.headers['X-Upssert-Trace'] = token;
      return token;
    }
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
      var _this3 = this;

      if (responseSet) {
        Object.keys(this.step.response).forEach(function (key) {
          var assertion = _this3.step.response[key];
          _this3.addEqualAssertionIfString(assertion, key);
          _this3.addAssertionsIfObject(assertion, key);
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
  }]);

  return Step;
}(_events.EventEmitter);

exports.default = Step;