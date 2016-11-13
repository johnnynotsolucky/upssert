"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var argToArray = function argToArray(arg) {
  return Array.isArray(arg) ? arg : arg ? [arg] : null;
};

var opts = function opts(argv) {
  var files = argToArray(argv.file || argv.f);
  var dirs = argToArray(argv.dir);
  var globPattern = argToArray(argv.glob || argv.g);
  var help = argv.help || argv.h;
  var version = argv.version;

  return {
    files: files,
    dirs: dirs,
    globPattern: globPattern,
    help: help,
    version: version
  };
};

exports.default = opts;