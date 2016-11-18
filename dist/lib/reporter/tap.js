'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../../data/events.json');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var name = function name(step) {
  return step.name.replace(/#/g, '_');
};

var TAP = function () {
  function TAP() {
    _classCallCheck(this, TAP);

    this.stepCount = 0;
    this.assertionCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 0;
    this.bail = false;
  }

  _createClass(TAP, [{
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
      runner.on(_events2.default.SUITE_STEP_COUNT, this.handleCount.bind(this));
      runner.on(_events2.default.SUITE_ASSERTION_COUNT, this.handleAssertCount.bind(this));
      runner.on(_events2.default.START, this.handleStart.bind(this));
      runner.on(_events2.default.SUITE_STEP_START, this.handleStepStart.bind(this));
      runner.on(_events2.default.SUITE_STEP_PASS, this.handleStepPass.bind(this));
      runner.on(_events2.default.SUITE_STEP_FAIL, this.handleStepFail.bind(this));
      runner.on(_events2.default.SUITE_FAIL, this.handleSuiteFail.bind(this));
      runner.on(_events2.default.END, this.handleEnd.bind(this));
    }
  }, {
    key: 'handleCount',
    value: function handleCount(count) {
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

      this.runIfNotBailed(function () {
        _this.writer.out('%d..%d', 1, _this.stepCount);
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
      var _this2 = this;

      this.passes += 1;
      this.runIfNotBailed(function () {
        _this2.writer.out('ok %d %s', _this2.tests, name(step));
      });
    }
  }, {
    key: 'handleStepFail',
    value: function handleStepFail(step, err) {
      var _this3 = this;

      this.fails += 1;
      this.runIfNotBailed(function () {
        var _writer;

        var out = ['not ok ' + _this3.tests + ' ' + name(step)];
        if (err.stack) {
          out.push(err.stack.replace(/^/gm, '  '));
        }
        (_writer = _this3.writer).lines.apply(_writer, out);
      });
    }
  }, {
    key: 'handleSuiteFail',
    value: function handleSuiteFail(suite, err) {
      this.bail = true;
      this.writer.out('Bail out! %s', err.message);
    }
  }, {
    key: 'handleEnd',
    value: function handleEnd() {
      var _this4 = this;

      this.runIfNotBailed(function () {
        var _writer2;

        var out = ['# tests ' + _this4.stepCount, '# pass ' + _this4.passes, '# fail ' + _this4.fails, '# assertions ' + _this4.assertionCount];
        (_writer2 = _this4.writer).lines.apply(_writer2, out);
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

  return TAP;
}();

exports.default = TAP;