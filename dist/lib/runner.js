'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _http = require('./http');

var _assert = require('./object/assert');

var _assert2 = _interopRequireDefault(_assert);

var _suite2 = require('./suite');

var _suite3 = _interopRequireDefault(_suite2);

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
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(suites) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, index, value, validation, suite, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _suite;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 3;

                for (_iterator = suites.entries()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _step$value = _slicedToArray(_step.value, 2), index = _step$value[0], value = _step$value[1];
                  validation = (0, _validateSuite2.default)(value);

                  if (validation === true) {
                    suite = new _suite3.default(value);

                    this.testCount += suite.tests.length;
                    this.assertionCount += suite.assertionCount;
                    suites[index] = suite;
                  } else {
                    this.stopExecution = true;
                    this.emit(_events3.default.FAIL, value, validation);
                    this.emit(_events3.default.SUITE_FAIL, value, validation);
                  }
                }
                _context.next = 11;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 11:
                _context.prev = 11;
                _context.prev = 12;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 14:
                _context.prev = 14;

                if (!_didIteratorError) {
                  _context.next = 17;
                  break;
                }

                throw _iteratorError;

              case 17:
                return _context.finish(14);

              case 18:
                return _context.finish(11);

              case 19:
                this.suiteCount = suites.length;
                this.emit(_events3.default.SUITE_COUNT, this.suiteCount);
                this.emit(_events3.default.TEST_COUNT, this.testCount);
                this.emit(_events3.default.ASSERTION_COUNT, this.assertionCount);
                this.emit(_events3.default.START);
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 27;
                _iterator2 = suites[Symbol.iterator]();

              case 29:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 42;
                  break;
                }

                _suite = _step2.value;

                if (this.stopExecution) {
                  _context.next = 38;
                  break;
                }

                this.emit(_events3.default.SUITE_START, _suite);
                _context.next = 35;
                return this.executeTestsInOrder(_suite);

              case 35:
                this.emit(_events3.default.SUITE_END, _suite);
                _context.next = 39;
                break;

              case 38:
                return _context.abrupt('break', 42);

              case 39:
                _iteratorNormalCompletion2 = true;
                _context.next = 29;
                break;

              case 42:
                _context.next = 48;
                break;

              case 44:
                _context.prev = 44;
                _context.t1 = _context['catch'](27);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t1;

              case 48:
                _context.prev = 48;
                _context.prev = 49;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 51:
                _context.prev = 51;

                if (!_didIteratorError2) {
                  _context.next = 54;
                  break;
                }

                throw _iteratorError2;

              case 54:
                return _context.finish(51);

              case 55:
                return _context.finish(48);

              case 56:
                this.emit(_events3.default.END);

              case 57:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 7, 11, 19], [12,, 14, 18], [27, 44, 48, 56], [49,, 51, 55]]);
      }));

      function run(_x) {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'executeTestsInOrder',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(suite) {
        var results, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, test, result;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                results = {};
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context2.prev = 4;
                _iterator3 = suite.tests[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context2.next = 15;
                  break;
                }

                test = _step3.value;
                _context2.next = 10;
                return this.executeTest(test, results);

              case 10:
                result = _context2.sent;

                results[result.test.id] = result;

              case 12:
                _iteratorNormalCompletion3 = true;
                _context2.next = 6;
                break;

              case 15:
                _context2.next = 21;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2['catch'](4);
                _didIteratorError3 = true;
                _iteratorError3 = _context2.t0;

              case 21:
                _context2.prev = 21;
                _context2.prev = 22;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 24:
                _context2.prev = 24;

                if (!_didIteratorError3) {
                  _context2.next = 27;
                  break;
                }

                throw _iteratorError3;

              case 27:
                return _context2.finish(24);

              case 28:
                return _context2.finish(21);

              case 29:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 17, 21, 29], [22,, 24, 28]]);
      }));

      function executeTestsInOrder(_x2) {
        return _ref2.apply(this, arguments);
      }

      return executeTestsInOrder;
    }()
  }, {
    key: 'executeTest',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(test, resultset) {
        var _this2 = this;

        var requiredData, data, httpRequest, testPassed, stat, result, response, assertObject;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
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
                _context3.prev = 7;
                _context3.next = 10;
                return (0, _http.makeRequest)(httpRequest);

              case 10:
                response = _context3.sent;

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
                _context3.next = 21;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3['catch'](7);

                this.emit(_events3.default.SUITE_TEST_FAIL, test, _context3.t0);

              case 21:
                result.pass = testPassed;
                return _context3.abrupt('return', result);

              case 23:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[7, 18]]);
      }));

      function executeTest(_x3, _x4) {
        return _ref3.apply(this, arguments);
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