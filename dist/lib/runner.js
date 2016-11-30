'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _http = require('./http');

var _assert = require('./object/assert');

var _assert2 = _interopRequireDefault(_assert);

var _suite = require('./suite');

var _suite2 = _interopRequireDefault(_suite);

var _events2 = require('../data/events.json');

var _events3 = _interopRequireDefault(_events2);

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _validateSuite = require('./validate-suite');

var _validateSuite2 = _interopRequireDefault(_validateSuite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Runner = function (_EventEmitter) {
  _inherits(Runner, _EventEmitter);

  function Runner(options) {
    _classCallCheck(this, Runner);

    var _this = _possibleConstructorReturn(this, (Runner.__proto__ || Object.getPrototypeOf(Runner)).call(this));

    _this.config = options.config;
    _this.suiteCount = 0;
    _this.testCount = 0;
    _this.assertionCount = 0;
    _this.stopExecution = false;
    return _this;
  }

  _createClass(Runner, [{
    key: 'run',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(definitions) {
        var suites;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                suites = this.suitesFromDefinitions(definitions);

                suites = this.startExecutionIfValid(suites);
                return _context.abrupt('return', suites);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run(_x) {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'suitesFromDefinitions',
    value: function suitesFromDefinitions(definitions) {
      var suites = [];
      var result = suites;
      while (definitions.length > 0 && !this.stopExecution) {
        var definition = definitions.shift();
        var validation = (0, _validateSuite2.default)(definition);
        if (validation === true) {
          var suite = new _suite2.default(definition);
          this.testCount += suite.tests.length;
          this.assertionCount += suite.assertionCount;
          suites.push(suite);
        } else {
          this.stopExecution = true;
          this.emit(_events3.default.FAIL, definition, validation);
          this.emit(_events3.default.SUITE_FAIL, definition, validation);
          result = false;
        }
      }
      return result;
    }
  }, {
    key: 'startExecutionIfValid',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(suites) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, suite;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(suites !== false)) {
                  _context2.next = 34;
                  break;
                }

                this.suiteCount = suites.length;
                this.emit(_events3.default.SUITE_COUNT, this.suiteCount);
                this.emit(_events3.default.TEST_COUNT, this.testCount);
                this.emit(_events3.default.ASSERTION_COUNT, this.assertionCount);
                this.emit(_events3.default.START);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 9;
                _iterator = suites[Symbol.iterator]();

              case 11:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 19;
                  break;
                }

                suite = _step.value;
                _context2.next = 15;
                return this.executeSuite(suite);

              case 15:
                suite.results = _context2.sent;

              case 16:
                _iteratorNormalCompletion = true;
                _context2.next = 11;
                break;

              case 19:
                _context2.next = 25;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2['catch'](9);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 25:
                _context2.prev = 25;
                _context2.prev = 26;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 28:
                _context2.prev = 28;

                if (!_didIteratorError) {
                  _context2.next = 31;
                  break;
                }

                throw _iteratorError;

              case 31:
                return _context2.finish(28);

              case 32:
                return _context2.finish(25);

              case 33:
                this.emit(_events3.default.END);

              case 34:
                return _context2.abrupt('return', suites);

              case 35:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[9, 21, 25, 33], [26,, 28, 32]]);
      }));

      function startExecutionIfValid(_x2) {
        return _ref2.apply(this, arguments);
      }

      return startExecutionIfValid;
    }()
  }, {
    key: 'executeSuite',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(suite) {
        var results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, test, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.emit(_events3.default.SUITE_START, suite);
                results = {};
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 5;
                _iterator2 = suite.tests[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context3.next = 16;
                  break;
                }

                test = _step2.value;
                _context3.next = 11;
                return this.executeTest(test, results);

              case 11:
                result = _context3.sent;

                results[result.test.id] = result;

              case 13:
                _iteratorNormalCompletion2 = true;
                _context3.next = 7;
                break;

              case 16:
                _context3.next = 22;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3['catch'](5);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t0;

              case 22:
                _context3.prev = 22;
                _context3.prev = 23;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 25:
                _context3.prev = 25;

                if (!_didIteratorError2) {
                  _context3.next = 28;
                  break;
                }

                throw _iteratorError2;

              case 28:
                return _context3.finish(25);

              case 29:
                return _context3.finish(22);

              case 30:
                this.emit(_events3.default.SUITE_END, suite);
                return _context3.abrupt('return', results);

              case 32:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 18, 22, 30], [23,, 25, 29]]);
      }));

      function executeSuite(_x3) {
        return _ref3.apply(this, arguments);
      }

      return executeSuite;
    }()
  }, {
    key: 'executeTest',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(test, resultset) {
        var _this2 = this;

        var requiredData, data, httpRequest, testPassed, stat, result, response, assertObject;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.emit(_events3.default.SUITE_TEST_START, test);
                requiredData = Runner.extractRequiredData(test, resultset);
                data = _extends({}, requiredData, _globals2.default);
                httpRequest = new _http.HttpRequest(test.request, data, this.config);
                testPassed = false;
                stat = void 0;
                result = {
                  trace: httpRequest.trace,
                  test: test
                };
                _context4.prev = 7;
                _context4.next = 10;
                return (0, _http.makeRequest)(httpRequest);

              case 10:
                response = _context4.sent;

                stat = (0, _http.httpStat)(response);
                testPassed = false;
                if (stat) {
                  assertObject = new _assert2.default(stat, test.assertions, data, this.config);

                  testPassed = assertObject.assert(function (err) {
                    _this2.emit(_events3.default.SUITE_TEST_FAIL, test, err);
                  });
                  if (testPassed) {
                    this.emit(_events3.default.SUITE_TEST_PASS, test);
                  }
                }
                this.emit(_events3.default.SUITE_TEST_END, test);
                result.result = stat;
                _context4.next = 21;
                break;

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4['catch'](7);

                this.emit(_events3.default.SUITE_TEST_FAIL, test, _context4.t0);

              case 21:
                result.pass = testPassed;
                return _context4.abrupt('return', result);

              case 23:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[7, 18]]);
      }));

      function executeTest(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return executeTest;
    }()
  }], [{
    key: 'extractRequiredData',
    value: function extractRequiredData(test, results) {
      var data = {};
      if (test.requires && results) {
        test.requires.forEach(function (id) {
          data[id] = results[id].result;
        });
      }
      return data;
    }
  }]);

  return Runner;
}(_events.EventEmitter);

exports.default = Runner;