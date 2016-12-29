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

  function Runner(config) {
    _classCallCheck(this, Runner);

    var _this = _possibleConstructorReturn(this, (Runner.__proto__ || Object.getPrototypeOf(Runner)).call(this));

    _this.config = config;
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
        var suites, results;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                suites = this.suitesFromDefinitions(definitions);
                _context.next = 3;
                return this.startExecutionIfValid(suites);

              case 3:
                results = _context.sent;
                return _context.abrupt('return', results);

              case 5:
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
          var dataPath = validation.dataPath || '/';
          result = {
            fail: '[' + dataPath + '] ' + validation.message
          };
        }
      }
      return result;
    }
  }, {
    key: 'startExecutionIfValid',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(suites) {
        var results, failMessage, passed, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, index, value, testResult;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                results = { pass: true };
                failMessage = void 0;
                passed = true;

                if (!suites.fail) {
                  _context2.next = 8;
                  break;
                }

                passed = false;
                failMessage = suites.fail;
                _context2.next = 43;
                break;

              case 8:
                this.suiteCount = suites.length;
                this.emit(_events3.default.SUITE_COUNT, this.suiteCount);
                this.emit(_events3.default.TEST_COUNT, this.testCount);
                this.emit(_events3.default.ASSERTION_COUNT, this.assertionCount);
                this.emit(_events3.default.START);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 16;
                _iterator = suites.entries()[Symbol.iterator]();

              case 18:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 28;
                  break;
                }

                _step$value = _slicedToArray(_step.value, 2), index = _step$value[0], value = _step$value[1];
                _context2.next = 22;
                return this.executeSuite(value);

              case 22:
                testResult = _context2.sent;

                results[index] = this.appendMetaData(testResult, value);
                if (testResult.pass === false) {
                  passed = false;
                }

              case 25:
                _iteratorNormalCompletion = true;
                _context2.next = 18;
                break;

              case 28:
                _context2.next = 34;
                break;

              case 30:
                _context2.prev = 30;
                _context2.t0 = _context2['catch'](16);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 34:
                _context2.prev = 34;
                _context2.prev = 35;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 37:
                _context2.prev = 37;

                if (!_didIteratorError) {
                  _context2.next = 40;
                  break;
                }

                throw _iteratorError;

              case 40:
                return _context2.finish(37);

              case 41:
                return _context2.finish(34);

              case 42:
                this.emit(_events3.default.END);

              case 43:
                results.pass = passed;
                if (!passed && failMessage) {
                  results.reason = failMessage;
                }
                return _context2.abrupt('return', results);

              case 46:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[16, 30, 34, 42], [35,, 37, 41]]);
      }));

      function startExecutionIfValid(_x2) {
        return _ref2.apply(this, arguments);
      }

      return startExecutionIfValid;
    }()
  }, {
    key: 'appendMetaData',
    value: function appendMetaData(result, suite) {
      if (suite.meta !== undefined && suite.meta !== null) {
        result.meta = suite.meta;
      } else {
        result.meta = {};
      }
      return result;
    }
  }, {
    key: 'executeSuite',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(suite) {
        var suitePassed, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, test, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.emit(_events3.default.SUITE_START, suite);
                suitePassed = true;
                results = { tests: {} };
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 6;
                _iterator2 = suite.tests[Symbol.iterator]();

              case 8:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context3.next = 18;
                  break;
                }

                test = _step2.value;
                _context3.next = 12;
                return this.executeTest(test, results.tests);

              case 12:
                result = _context3.sent;

                results.tests[test.id] = result;
                if (result.pass === false) {
                  suitePassed = false;
                }

              case 15:
                _iteratorNormalCompletion2 = true;
                _context3.next = 8;
                break;

              case 18:
                _context3.next = 24;
                break;

              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3['catch'](6);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t0;

              case 24:
                _context3.prev = 24;
                _context3.prev = 25;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 27:
                _context3.prev = 27;

                if (!_didIteratorError2) {
                  _context3.next = 30;
                  break;
                }

                throw _iteratorError2;

              case 30:
                return _context3.finish(27);

              case 31:
                return _context3.finish(24);

              case 32:
                results.pass = suitePassed;
                this.emit(_events3.default.SUITE_END, suite);
                return _context3.abrupt('return', results);

              case 35:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[6, 20, 24, 32], [25,, 27, 31]]);
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

        var dependencies, result, failMessage, testPassed, err, globals, data, httpRequest, formattedResponse, response, assertObject;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.emit(_events3.default.SUITE_TEST_START, test);
                dependencies = this.extractDependencies(test, resultset);
                result = {};
                failMessage = void 0;
                testPassed = false;

                if (!this.dependenciesHaveFailed(dependencies)) {
                  _context4.next = 11;
                  break;
                }

                err = new Error('Failed dependencies');

                failMessage = err.message;
                this.emit(_events3.default.SUITE_TEST_FAIL, test, err);
                _context4.next = 31;
                break;

              case 11:
                globals = (0, _globals2.default)(this.config);
                data = _extends({}, dependencies, globals);
                httpRequest = new _http.HttpRequest(test.request, data, this.config);

                result.trace = httpRequest.trace;
                formattedResponse = void 0;
                _context4.prev = 16;
                _context4.next = 19;
                return (0, _http.makeRequest)(httpRequest);

              case 19:
                response = _context4.sent;

                formattedResponse = (0, _http.formatResponse)(response);
                testPassed = false;
                if (formattedResponse) {
                  assertObject = new _assert2.default(formattedResponse, test.assertions, data, this.config);

                  testPassed = assertObject.assert(function (err) {
                    failMessage = err.message;
                    _this2.emit(_events3.default.SUITE_TEST_FAIL, test, err);
                  });
                  if (testPassed) {
                    this.emit(_events3.default.SUITE_TEST_PASS, test);
                  }
                }
                this.emit(_events3.default.SUITE_TEST_END, test);
                result.response = formattedResponse;
                _context4.next = 31;
                break;

              case 27:
                _context4.prev = 27;
                _context4.t0 = _context4['catch'](16);

                failMessage = _context4.t0.message;
                this.emit(_events3.default.SUITE_TEST_FAIL, test, _context4.t0);

              case 31:
                result.pass = testPassed;
                if (!testPassed) {
                  result.reason = failMessage;
                }
                return _context4.abrupt('return', result);

              case 34:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[16, 27]]);
      }));

      function executeTest(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return executeTest;
    }()
  }, {
    key: 'dependenciesHaveFailed',
    value: function dependenciesHaveFailed(dependencies) {
      return Object.keys(dependencies).map(function (key) {
        return dependencies[key];
      }).some(function (dependency) {
        return dependency.pass !== true;
      });
    }
  }, {
    key: 'extractDependencies',
    value: function extractDependencies(test, results) {
      var data = {};
      if (test.requires && results) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = test.requires[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var id = _step3.value;

            data[id] = _extends({}, results[id].response, {
              pass: results[id].pass
            });
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
      return data;
    }
  }]);

  return Runner;
}(_events.EventEmitter);

exports.default = Runner;