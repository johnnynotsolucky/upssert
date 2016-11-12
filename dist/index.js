'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _runner = require('./lib/runner');

var _runner2 = _interopRequireDefault(_runner);

var _tap = require('./lib/reporter/tap');

var _tap2 = _interopRequireDefault(_tap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {
  var runner = new _runner2.default([{ name: 'Test',
    steps: [{
      name: 'Something#hmmm',
      request: {
        url: 'https://httpbin.org/get?a=b',
        method: 'GET'
      },
      response: {
        'content-type': 'application/json',
        'status-code': {
          'equal': 200
        },
        'timing.dns-resolution': {
          'is-below': 100
        },
        'timing.total': {
          'is-below': 500
        }
      }
    }, {
      name: 'Something else',
      'needs-previous-step': false,
      request: {
        url: 'https://httpbin.org/get?a=b',
        method: 'GET'
      },
      response: {
        'content-type': 'application/json',
        'status-code': {
          'equal': 200
        },
        'timing.dns-resolution': {
          'is-below': 100
        },
        'timing.total': {
          'is-below': 500
        }
      }
    }]
  }]);

  new _tap2.default(runner);
  runner.run();
}

exports.default = run();