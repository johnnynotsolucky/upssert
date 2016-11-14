'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpstat = require('httpstat');

var _httpstat2 = _interopRequireDefault(_httpstat);

var _transposeStatResult = require('./transposeStatResult');

var _transposeStatResult2 = _interopRequireDefault(_transposeStatResult);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

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
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var _ret;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
                  var form, data, headers, key, value, concatenated, result, object;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          form = void 0;

                          if (_this.step.request.form) {
                            form = [];
                            _this.step.request.form.forEach(function (item) {
                              var renderedKey = (0, _renderer2.default)(item.key, _this.resultset);
                              var renderedValue = (0, _renderer2.default)(item.value, _this.resultset);
                              var formItem = renderedKey + '=' + renderedValue;
                              form.push(formItem);
                            });
                          }
                          data = (0, _renderer2.default)(_this.step.request.data, _this.resultset);
                          headers = void 0;

                          if (_this.step.request.headers) {
                            headers = [];
                            for (key in _this.step.request.headers) {
                              value = _this.step.request.headers[key];
                              concatenated = key + ': ' + value;

                              headers.push(concatenated);
                            }
                          }
                          _context.next = 7;
                          return (0, _httpstat2.default)(_this.step.request.url, {
                            method: _this.step.request.method
                          }, headers, data, form);

                        case 7:
                          result = _context.sent;
                          object = (0, _transposeStatResult2.default)(result);
                          return _context.abrupt('return', {
                            v: object
                          });

                        case 10:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                })(), 't0', 2);

              case 2:
                _ret = _context2.t0;

                if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return', _ret.v);

              case 5:
                _context2.next = 11;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t1 = _context2['catch'](0);

                this.emit(events.SUITE_STEP_FAIL, this.step, _context2.t1);
                return _context2.abrupt('return', false);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function execute() {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }]);

  return HttpRequest;
}();

exports.default = HttpRequest;