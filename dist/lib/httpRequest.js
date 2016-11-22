'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpstat = require('httpstat');

var _httpstat2 = _interopRequireDefault(_httpstat);

var _transposeStatResult = require('./transposeStatResult');

var _transposeStatResult2 = _interopRequireDefault(_transposeStatResult);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _events = require('../data/events.json');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpRequest = function () {
  function HttpRequest(step, resultset) {
    _classCallCheck(this, HttpRequest);

    this.step = step;
    this.resultset = resultset;
  }

  _createClass(HttpRequest, [{
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var result, form, data, headers, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                result = void 0;
                _context.prev = 1;
                form = this.formatFormData();
                data = this.formatData();
                headers = this.formatRequestHeaders();
                _context.next = 7;
                return this.makeRequest(form, data, headers);

              case 7:
                response = _context.sent;

                result = response;
                _context.next = 15;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](1);

                this.emit(_events2.default.SUITE_TEST_FAIL, this.step, _context.t0);
                result = false;

              case 15:
                return _context.abrupt('return', result);

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 11]]);
      }));

      function execute() {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: 'formatFormData',
    value: function formatFormData() {
      var _this = this;

      var form = void 0;
      if (this.step.request.form) {
        form = [];
        this.step.request.form.forEach(function (item) {
          var renderedKey = (0, _renderer2.default)(item.key, _this.resultset);
          var renderedValue = (0, _renderer2.default)(item.value, _this.resultset);
          var formItem = renderedKey + '=' + renderedValue;
          form.push(formItem);
        });
      }
      return form;
    }
  }, {
    key: 'formatData',
    value: function formatData() {
      return (0, _renderer2.default)(this.step.request.data, this.resultset);
    }
  }, {
    key: 'formatRequestHeaders',
    value: function formatRequestHeaders() {
      var _this2 = this;

      var headers = [];
      if (this.step.request.headers) {
        Object.keys(this.step.request.headers).forEach(function (key) {
          var value = _this2.step.request.headers[key];
          var concatenated = key + ': ' + value;
          headers.push(concatenated);
        });
      }
      return headers;
    }
  }, {
    key: 'makeRequest',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(form, data, headers) {
        var url, method, response, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = this.step.request.url;
                method = { method: this.step.request.method };
                _context2.next = 4;
                return (0, _httpstat2.default)(url, method, headers, data, form);

              case 4:
                response = _context2.sent;
                result = (0, _transposeStatResult2.default)(response);
                return _context2.abrupt('return', result);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function makeRequest(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return makeRequest;
    }()
  }]);

  return HttpRequest;
}();

exports.default = HttpRequest;