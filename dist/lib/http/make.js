'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeRequest = undefined;

var _ramda = require('ramda');

var _ramdaFantasy = require('ramda-fantasy');

var _httpstat = require('httpstat');

var _httpstat2 = _interopRequireDefault(_httpstat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// destructureParams :: a -> [b]
var destructureParams = function destructureParams(x) {
  return [x.url, { method: x.method }, x.headers, x.data, x.form];
};

// httpstatFuture :: [a] -> Future b
var httpstatFuture = function httpstatFuture(params) {
  return (0, _ramdaFantasy.Future)(function (rej, res) {
    return _httpstat2.default.apply(undefined, _toConsumableArray(params)).then(res).catch(rej);
  });
};

// httpstatFuture :: a -> Future b
var executeRequest = (0, _ramda.compose)(httpstatFuture, destructureParams);

exports.executeRequest = executeRequest;

// TODO replace with `httpstatFuture`

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _httpstat2.default.apply(undefined, _toConsumableArray(destructureParams(request)));

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
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