'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpstat = require('httpstat');

var _httpstat2 = _interopRequireDefault(_httpstat);

var _transposeStatResult = require('./transposeStatResult');

var _transposeStatResult2 = _interopRequireDefault(_transposeStatResult);

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
        var result, object;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return (0, _httpstat2.default)(this.step.request.url, {
                  method: this.step.request.method
                });

              case 3:
                result = _context.sent;

                //TODO use mustache templating and add post data, etc
                object = (0, _transposeStatResult2.default)(result);
                return _context.abrupt('return', object);

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);

                this.emit(events.SUITE_STEP_FAIL, this.step, _context.t0);
                return _context.abrupt('return', false);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
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