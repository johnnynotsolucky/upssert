'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readJsonFile = require('./read-json-file');

var _readJsonFile2 = _interopRequireDefault(_readJsonFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var opts = function opts(argv) {
  var help = argv.help || argv.h;
  var version = argv.version;
  var url = argv.url;
  var reporter = argv.reporter || argv.r || 'console';

  var files = [];

  var getClientPackage = function getClientPackage() {
    var result = {};
    var clientPackage = (0, _readJsonFile2.default)(process.cwd() + '/package.json');
    if (clientPackage && clientPackage.upssert) {
      result = clientPackage.upssert;
    }
    return result;
  };

  var globPattern = function globPattern(pattern) {
    var clientPackage = getClientPackage();
    var globOptions = clientPackage.globOpts || [];
    var globbed = _glob2.default.sync(pattern, globOptions);
    files.push.apply(files, _toConsumableArray(globbed));
  };

  if (argv._.length === 0) {
    var clientPackage = getClientPackage();
    if (clientPackage.testDir) {
      argv._.push(clientPackage.testDir);
    } else {
      argv._.push(process.cwd() + '/test/api/*.json');
    }
  }
  argv._.forEach(function (pattern) {
    if (!pattern.startsWith('/')) {
      pattern = process.cwd() + '/' + pattern;
    }
    var stat = void 0;
    try {
      stat = _fs2.default.statSync(pattern);
    } catch (err) {
      // noOp
    }
    if (stat && stat.isDirectory()) {
      pattern = pattern + '/**/*.json';
    }
    globPattern(pattern);
  });

  return {
    help: help,
    version: version,
    files: files,
    url: url,
    reporter: reporter
  };
};

exports.default = opts;