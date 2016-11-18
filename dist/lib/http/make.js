'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpstat = require('httpstat');

var _httpstat2 = _interopRequireDefault(_httpstat);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
    var method, params, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(request instanceof _request2.default)) {
              _context.next = 7;
              break;
            }

            method = { method: request.method };
            params = [request.url, method, request.headers, request.data, request.form];
            _context.next = 5;
            return _httpstat2.default.apply(undefined, params);

          case 5:
            response = _context.sent;
            return _context.abrupt('return', response);

          case 7:
            throw new Error('request must be an instance of HttpRequest');

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();