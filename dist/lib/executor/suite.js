'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _tv = require('tv4');

var _tv2 = _interopRequireDefault(_tv);

var _testCaseSchema = require('../../data/test-case-schema.json');

var _testCaseSchema2 = _interopRequireDefault(_testCaseSchema);

var _step4 = require('./step');

var _step5 = _interopRequireDefault(_step4);

var _events2 = require('../../data/events.json');

var _events3 = _interopRequireDefault(_events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Suite = function (_EventEmitter) {
  _inherits(Suite, _EventEmitter);

  function Suite(testCase) {
    _classCallCheck(this, Suite);

    var _this = _possibleConstructorReturn(this, (Suite.__proto__ || Object.getPrototypeOf(Suite)).call(this));

    _this.bindEmitters();
    _this.testCase = testCase;
    _this.stepExecutors = [];
    return _this;
  }

  _createClass(Suite, [{
    key: 'bindEmitters',
    value: function bindEmitters() {
      this.stepStart = this.stepStart.bind(this);
      this.stepEnd = this.stepEnd.bind(this);
      this.stepPass = this.stepPass.bind(this);
      this.stepFail = this.stepFail.bind(this);
      this.assertionCount = this.assertionCount.bind(this);
    }
  }, {
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.emit(_events3.default.SUITE_START, this.testCase);
                _context.next = 3;
                return this.executeStepsInOrder(this.testCase.steps);

              case 3:
                this.emit(_events3.default.SUITE_END, this.testCase);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute() {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'initialize',
    value: function initialize() {
      var testValid = _tv2.default.validate(this.testCase, _testCaseSchema2.default);
      if (testValid) {
        this.initializeSteps();
      } else {
        this.emit(_events3.default.SUITE_FAIL, this.testCase, _tv2.default.error);
      }
    }
  }, {
    key: 'initializeSteps',
    value: function initializeSteps() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.testCase.steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step2 = _step.value;

          var executor = new _step5.default(_step2);
          executor.on(_events3.default.SUITE_STEP_START, this.stepStart);
          executor.on(_events3.default.SUITE_STEP_END, this.stepEnd);
          executor.on(_events3.default.SUITE_STEP_PASS, this.stepPass);
          executor.on(_events3.default.SUITE_STEP_FAIL, this.stepFail);
          executor.on(_events3.default.SUITE_ASSERTION_COUNT, this.assertionCount);
          executor.initialize();
          this.stepExecutors.push(executor);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.emit(_events3.default.SUITE_STEP_COUNT, this.testCase.steps.length);
    }
  }, {
    key: 'executeStepsInOrder',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(steps) {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step3, executor;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 3;
                _iterator2 = this.stepExecutors[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion2 = (_step3 = _iterator2.next()).done) {
                  _context2.next = 12;
                  break;
                }

                executor = _step3.value;
                _context2.next = 9;
                return executor.execute();

              case 9:
                _iteratorNormalCompletion2 = true;
                _context2.next = 5;
                break;

              case 12:
                _context2.next = 18;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 18:
                _context2.prev = 18;
                _context2.prev = 19;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 21:
                _context2.prev = 21;

                if (!_didIteratorError2) {
                  _context2.next = 24;
                  break;
                }

                throw _iteratorError2;

              case 24:
                return _context2.finish(21);

              case 25:
                return _context2.finish(18);

              case 26:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 14, 18, 26], [19,, 21, 25]]);
      }));

      function executeStepsInOrder(_x) {
        return _ref2.apply(this, arguments);
      }

      return executeStepsInOrder;
    }()
  }, {
    key: 'stepStart',
    value: function stepStart(step) {
      this.emit(_events3.default.SUITE_STEP_START, step);
    }
  }, {
    key: 'stepEnd',
    value: function stepEnd(step) {
      this.emit(_events3.default.SUITE_STEP_END, step);
    }
  }, {
    key: 'stepPass',
    value: function stepPass(step) {
      this.emit(_events3.default.SUITE_STEP_PASS, step);
    }
  }, {
    key: 'stepFail',
    value: function stepFail(step, err) {
      this.emit(_events3.default.SUITE_STEP_FAIL, step, err);
    }
  }, {
    key: 'assertionCount',
    value: function assertionCount(count) {
      this.emit(_events3.default.SUITE_ASSERTION_COUNT, count);
    }
  }]);

  return Suite;
}(_events.EventEmitter);

exports.default = Suite;