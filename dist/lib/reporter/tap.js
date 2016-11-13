'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../../data/events.json');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAP = function () {
  function TAP(runner) {
    _classCallCheck(this, TAP);

    this.stepCount = 0;
    this.assertionCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 1;
    this.bail = false;
    this.bindHandlers(runner);
  }

  _createClass(TAP, [{
    key: 'bindHandlers',
    value: function bindHandlers(runner) {
      runner.on(_events2.default.SUITE_STEP_COUNT, this.handleCount.bind(this));
      runner.on(_events2.default.SUITE_ASSERTION_COUNT, this.handleAssertCount.bind(this));
      runner.on(_events2.default.START, this.handleStart.bind(this));
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
        console.log('%d..%d', 1, _this.stepCount);
      });
    }
  }, {
    key: 'handleStepPass',
    value: function handleStepPass(step) {
      var _this2 = this;

      this.passes++;
      this.runIfNotBailed(function () {
        console.log('ok %d %s', _this2.tests, _this2.name(step));
      });
    }
  }, {
    key: 'handleStepFail',
    value: function handleStepFail(step, err) {
      var _this3 = this;

      this.fails++;
      this.runIfNotBailed(function () {
        console.log('not ok %d %s', _this3.tests, _this3.name(step));
        if (err.stack) {
          console.log(err.stack.replace(/^/gm, '  '));
        }
      });
    }
  }, {
    key: 'handleSuiteFail',
    value: function handleSuiteFail(suite, err) {
      this.bail = true;
      console.log('Bail out! %s', err.message);
    }
  }, {
    key: 'handleEnd',
    value: function handleEnd() {
      var _this4 = this;

      this.runIfNotBailed(function () {
        console.log('# tests ' + _this4.stepCount);
        console.log('# pass ' + _this4.passes);
        console.log('# fail ' + _this4.fails);
        console.log('# assertions ' + _this4.assertionCount);
      });
    }
  }, {
    key: 'runIfNotBailed',
    value: function runIfNotBailed(fn) {
      if (!this.bail) {
        fn();
      }
    }
  }, {
    key: 'name',
    value: function name(step) {
      return step.name.replace(/#/g, '_');
    }
  }]);

  return TAP;
}();

exports.default = TAP;