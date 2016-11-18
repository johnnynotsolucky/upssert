'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _events = require('events');

var _events2 = require('./data/events.json');

var _events3 = _interopRequireDefault(_events2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Upssert = function (_EventEmitter) {
  _inherits(Upssert, _EventEmitter);

  function Upssert(suites, runner, reporter, writer) {
    _classCallCheck(this, Upssert);

    var _this = _possibleConstructorReturn(this, (Upssert.__proto__ || Object.getPrototypeOf(Upssert)).call(this));

    _this.suites = !Array.isArray(suites) ? [suites] : suites;
    _this.runner = runner;
    _this.writer = writer;
    _this.reporter = reporter;
    _this.runner.setSuites(_this.suites);
    _this.reporter.setRunner(_this.runner);
    _this.reporter.setWriter(_this.writer);
    _this.runner.on(_events3.default.FAIL, function (obj, err) {
      _this.emit(_events3.default.FAIL, obj, err);
    });
    return _this;
  }

  _createClass(Upssert, [{
    key: 'execute',
    value: function execute() {
      this.runner.run();
    }
  }]);

  return Upssert;
}(_events.EventEmitter);

exports.default = Upssert;