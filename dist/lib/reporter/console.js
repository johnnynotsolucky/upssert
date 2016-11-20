'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('colors');

var _time = require('../util/time');

var _time2 = _interopRequireDefault(_time);

var _symbols = require('./symbols');

var _symbols2 = _interopRequireDefault(_symbols);

var _events = require('../../data/events.json');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Console = function () {
  function Console() {
    _classCallCheck(this, Console);

    this.suiteCount = 0;
    this.stepCount = 0;
    this.assertionCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 0;
    this.bail = false;
    this.failLog = [];
    this.startTime = 0;
  }

  _createClass(Console, [{
    key: 'setWriter',
    value: function setWriter(writer) {
      this.writer = writer;
    }
  }, {
    key: 'setRunner',
    value: function setRunner(runner) {
      this.bindHandlers(runner);
    }
  }, {
    key: 'bindHandlers',
    value: function bindHandlers(runner) {
      runner.on(_events2.default.SUITE_COUNT, this.handleCount.bind(this));
      runner.on(_events2.default.SUITE_STEP_COUNT, this.handleStepCount.bind(this));
      runner.on(_events2.default.SUITE_ASSERTION_COUNT, this.handleAssertCount.bind(this));
      runner.on(_events2.default.START, this.handleStart.bind(this));
      runner.on(_events2.default.SUITE_START, this.handleSuiteStart.bind(this));
      runner.on(_events2.default.SUITE_STEP_START, this.handleStepStart.bind(this));
      runner.on(_events2.default.SUITE_STEP_PASS, this.handleStepPass.bind(this));
      runner.on(_events2.default.SUITE_STEP_FAIL, this.handleStepFail.bind(this));
      runner.on(_events2.default.SUITE_FAIL, this.handleSuiteFail.bind(this));
      runner.on(_events2.default.END, this.handleEnd.bind(this));
    }
  }, {
    key: 'handleCount',
    value: function handleCount(count) {
      this.suiteCount += count;
    }
  }, {
    key: 'handleStepCount',
    value: function handleStepCount(count) {
      this.stepCount += count;
    }
  }, {
    key: 'handleAssertCount',
    value: function handleAssertCount(count) {
      this.assertionCount += count;
    }
  }, {
    key: 'handleStart',
    value: function handleStart() {
      var _this = this;

      this.startTime = Date.now();
      this.runIfNotBailed(function () {
        var title = '\n  Executing ' + _this.suiteCount + ' test suites';
        title = title + ' (' + _this.assertionCount + ' assertions)' + _symbols2.default.ellipsis;
        _this.writer.out(title.grey);
      });
    }
  }, {
    key: 'handleSuiteStart',
    value: function handleSuiteStart(suite) {
      var _this2 = this;

      this.runIfNotBailed(function () {
        _this2.writer.out('\n  ' + suite.name.white);
      });
    }
  }, {
    key: 'handleStepStart',
    value: function handleStepStart() {
      this.tests += 1;
    }
  }, {
    key: 'handleStepPass',
    value: function handleStepPass(step) {
      var _this3 = this;

      this.passes += 1;
      this.runIfNotBailed(function () {
        var out = '    ' + _symbols2.default.ok.green + ' ' + step.name.grey;
        _this3.writer.out(out);
      });
    }
  }, {
    key: 'handleStepFail',
    value: function handleStepFail(step, err) {
      var _this4 = this;

      this.fails += 1;
      this.runIfNotBailed(function () {
        _this4.failLog.push({ step: step, error: err });
        var out = '    ' + _symbols2.default.error.red + ' ' + step.name.red;
        _this4.writer.out(out);
      });
    }
  }, {
    key: 'handleSuiteFail',
    value: function handleSuiteFail(suite, err) {
      var _writer;

      this.bail = true;
      var out = [_symbols2.default.error.red + ' ' + suite.name.red, err.message];
      if (err.stack) {
        out.push(err.stack.replace(/^/gm, '  ').grey);
      }
      (_writer = this.writer).lines.apply(_writer, out);
    }
  }, {
    key: 'handleEnd',
    value: function handleEnd() {
      var _this5 = this;

      this.runIfNotBailed(function () {
        var _writer3;

        var duration = (0, _time2.default)(Date.now() - _this5.startTime);

        if (_this5.failLog.length > 0) {
          _this5.failLog.forEach(function (_ref, index) {
            var _writer2;

            var step = _ref.step,
                error = _ref.error;

            var errorOutput = ['', '  ' + (index + 1) + ') ' + step.name.red, ('  Error: ' + error.message).white];
            if (error.stack) {
              errorOutput.push(error.stack.replace(/^/gm, '  ').grey);
            }
            (_writer2 = _this5.writer).lines.apply(_writer2, errorOutput);
          });
        }
        var out = ['', '  ' + (_this5.passes + ' passing').green + ' ' + ('(' + duration + ')').grey, ''];
        if (_this5.fails > 0) {
          out.splice(2, 0, '  ' + (_this5.fails + ' failing').red);
        }
        (_writer3 = _this5.writer).lines.apply(_writer3, out);
      });
    }
  }, {
    key: 'runIfNotBailed',
    value: function runIfNotBailed(fn) {
      if (!this.bail) {
        fn();
      }
    }
  }]);

  return Console;
}();

exports.default = Console;