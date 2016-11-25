"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (milliseconds) {
  var seconds = milliseconds / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var result = void 0;
  if (hours >= 1) {
    result = hours.toFixed(3) + "h";
  } else if (minutes >= 1) {
    result = minutes.toFixed(3) + "m";
  } else if (seconds >= 1) {
    result = seconds.toFixed(3) + "s";
  } else {
    result = milliseconds + "ms";
  }
  return result;
};