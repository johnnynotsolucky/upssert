'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var symbols = {
  ok: '✓',
  error: '✖',
  ellipsis: '…',
  listMultiple: '├',
  listSingle: '└'
};

if (process.platform === 'win32') {
  symbols.ok = '\u221A';
  symbols.error = '\xD7';
}

exports.default = symbols;