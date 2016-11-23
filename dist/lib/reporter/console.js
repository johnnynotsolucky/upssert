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
    this.testCount = 0;
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
    key: 'setEventEmitter',
    value: function setEventEmitter(emitter) {
      this.bindHandlers(emitter);
    }
  }, {
    key: 'bindHandlers',
    value: function bindHandlers(emitter) {
      emitter.on(_events2.default.SUITE_COUNT, this.handleCount.bind(this));
      emitter.on(_events2.default.SUITE_TEST_COUNT, this.handleTestCount.bind(this));
      emitter.on(_events2.default.SUITE_ASSERTION_COUNT, this.handleAssertCount.bind(this));
      emitter.on(_events2.default.START, this.handleStart.bind(this));
      emitter.on(_events2.default.SUITE_START, this.handleSuiteStart.bind(this));
      emitter.on(_events2.default.SUITE_TEST_START, this.handleTestStart.bind(this));
      emitter.on(_events2.default.SUITE_TEST_PASS, this.handleTestPass.bind(this));
      emitter.on(_events2.default.SUITE_TEST_FAIL, this.handleTestFail.bind(this));
      emitter.on(_events2.default.SUITE_FAIL, this.handleSuiteFail.bind(this));
      emitter.on(_events2.default.END, this.handleEnd.bind(this));
    }
  }, {
    key: 'handleCount',
    value: function handleCount(count) {
      this.suiteCount += count;
    }
  }, {
    key: 'handleTestCount',
    value: function handleTestCount(count) {
      this.testCount += count;
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
    key: 'handleTestStart',
    value: function handleTestStart() {
      this.tests += 1;
    }
  }, {
    key: 'handleTestPass',
    value: function handleTestPass(test) {
      var _this3 = this;

      this.passes += 1;
      this.runIfNotBailed(function () {
        var out = '    ' + _symbols2.default.ok.green + ' ' + test.name.grey;
        _this3.writer.out(out);
      });
    }
  }, {
    key: 'handleTestFail',
    value: function handleTestFail(test, err) {
      var _this4 = this;

      this.fails += 1;
      this.runIfNotBailed(function () {
        _this4.failLog.push({ test: test, error: err });
        var out = ('    ' + _symbols2.default.error + ' ' + test.name).red;
        _this4.writer.out(out);
      });
    }
  }, {
    key: 'handleSuiteFail',
    value: function handleSuiteFail(suite, err) {
      var _writer;

      this.bail = true;
      var out = [(_symbols2.default.error + ' ' + suite.name).red, err.message];
      (_writer = this.writer).lines.apply(_writer, out);
    }
  }, {
    key: 'handleEnd',
    value: function handleEnd() {
      var _this5 = this;

      this.runIfNotBailed(function () {
        var _writer3;

        var duration = (0, _time2.default)(Date.now() - _this5.startTime);

        _this5.failLog.forEach(function (_ref, index) {
          var _writer2;

          var test = _ref.test,
              error = _ref.error;

          var errorOutput = ['', '  ' + (index + 1) + ') ' + test.name.red, ('  Error: ' + error.message).white];
          (_writer2 = _this5.writer).lines.apply(_writer2, errorOutput);
        });
        var out = ['', '  ' + (_this5.passes + ' passing').green + ' ' + ('(' + duration + ')').grey, ''];
        if (_this5.fails > 0) {
          out.splice(2, 0, ('  ' + _this5.fails + ' failing').red);
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