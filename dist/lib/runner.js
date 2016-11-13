'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _suite = require('./executor/suite');

var _suite2 = _interopRequireDefault(_suite);

var _events2 = require('../data/events.json');

var _events3 = _interopRequireDefault(_events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Runner = function (_EventEmitter) {
  _inherits(Runner, _EventEmitter);

  function Runner(suites) {
    _classCallCheck(this, Runner);

    var _this = _possibleConstructorReturn(this, (Runner.__proto__ || Object.getPrototypeOf(Runner)).call(this));

    _this.bindEmitters();
    _this.suites = suites;
    _this.executors = [];
    return _this;
  }

  _createClass(Runner, [{
    key: 'bindEmitters',
    value: function bindEmitters() {
      this.suiteStart = this.suiteStart.bind(this);
      this.suiteEnd = this.suiteEnd.bind(this);
      this.suiteFail = this.suiteFail.bind(this);
      this.suiteStepStart = this.suiteStepStart.bind(this);
      this.suiteStepEnd = this.suiteStepEnd.bind(this);
      this.suiteStepPass = this.suiteStepPass.bind(this);
      this.suiteStepFail = this.suiteStepFail.bind(this);
      this.suiteAssertionCount = this.suiteAssertionCount.bind(this);
      this.suiteStepCount = this.suiteStepCount.bind(this);
    }
  }, {
    key: 'run',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, executor;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.initialize();
                this.emit(_events3.default.START);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;
                _iterator = this.executors[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 14;
                  break;
                }

                executor = _step.value;
                _context.next = 11;
                return executor.execute();

              case 11:
                _iteratorNormalCompletion = true;
                _context.next = 7;
                break;

              case 14:
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 20:
                _context.prev = 20;
                _context.prev = 21;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 23:
                _context.prev = 23;

                if (!_didIteratorError) {
                  _context.next = 26;
                  break;
                }

                throw _iteratorError;

              case 26:
                return _context.finish(23);

              case 27:
                return _context.finish(20);

              case 28:
                this.emit(_events3.default.END);

              case 29:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 16, 20, 28], [21,, 23, 27]]);
      }));

      function run() {
        return _ref.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      this.suites.forEach(function (suite) {
        var executor = new _suite2.default(suite);
        executor.on(_events3.default.SUITE_START, _this2.suiteStart);
        executor.on(_events3.default.SUITE_END, _this2.suiteEnd);
        executor.on(_events3.default.SUITE_FAIL, _this2.suiteFail);
        executor.on(_events3.default.SUITE_STEP_START, _this2.suiteStepStart);
        executor.on(_events3.default.SUITE_STEP_END, _this2.suiteStepEnd);
        executor.on(_events3.default.SUITE_STEP_PASS, _this2.suiteStepPass);
        executor.on(_events3.default.SUITE_STEP_FAIL, _this2.suiteStepFail);
        executor.on(_events3.default.SUITE_ASSERTION_COUNT, _this2.suiteAssertionCount);
        executor.on(_events3.default.SUITE_STEP_COUNT, _this2.suiteStepCount);
        executor.initialize();
        _this2.executors.push(executor);
      });
    }
  }, {
    key: 'suiteStart',
    value: function suiteStart(suite) {
      this.emit(_events3.default.SUITE_START, suite);
    }
  }, {
    key: 'suiteEnd',
    value: function suiteEnd(suite) {
      this.emit(_events3.default.SUITE_END, suite);
    }
  }, {
    key: 'suiteFail',
    value: function suiteFail(suite, err) {
      this.emit(_events3.default.FAIL, suite, err);
      this.emit(_events3.default.SUITE_FAIL, suite, err);
    }
  }, {
    key: 'suiteStepStart',
    value: function suiteStepStart(step) {
      this.emit(_events3.default.SUITE_STEP_START, step);
    }
  }, {
    key: 'suiteStepEnd',
    value: function suiteStepEnd(step) {
      this.emit(_events3.default.SUITE_STEP_END, step);
    }
  }, {
    key: 'suiteStepPass',
    value: function suiteStepPass(step) {
      this.emit(_events3.default.SUITE_STEP_PASS, step);
    }
  }, {
    key: 'suiteStepFail',
    value: function suiteStepFail(step, err) {
      this.emit(_events3.default.FAIL, step, err);
      this.emit(_events3.default.SUITE_STEP_FAIL, step, err);
    }
  }, {
    key: 'suiteAssertionCount',
    value: function suiteAssertionCount(count) {
      this.emit(_events3.default.SUITE_ASSERTION_COUNT, count);
    }
  }, {
    key: 'suiteStepCount',
    value: function suiteStepCount(count) {
      this.emit(_events3.default.SUITE_STEP_COUNT, count);
    }
  }]);

  return Runner;
}(_events.EventEmitter);

exports.default = Runner;