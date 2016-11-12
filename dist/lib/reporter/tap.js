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
      console.log('%d..%d', 1, this.stepCount);
    }
  }, {
    key: 'handleStepPass',
    value: function handleStepPass(step) {
      this.passes++;
      console.log('ok %d %s', this.tests, this.name(step));
    }
  }, {
    key: 'handleStepFail',
    value: function handleStepFail(step, err) {
      this.fails++;
      console.log('not ok %d %s', this.tests, this.name(step));
      if (err.stack) {
        console.log(err.stack.replace(/^/gm, '  '));
      }
    }
  }, {
    key: 'handleEnd',
    value: function handleEnd() {
      console.log('# tests ' + this.stepCount);
      console.log('# pass ' + this.passes);
      console.log('# fail ' + this.fails);
      console.log('# assertions ' + this.assertionCount);
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