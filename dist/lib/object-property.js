'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getObjectFromBracketNotation = function getObjectFromBracketNotation(object, property, bracketNotation) {
  var parentProperty = property.substr(0, property.match(/\[/).index);
  var newObject = object[(0, _camelcase2.default)(parentProperty)];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = bracketNotation[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      newObject = newObject[part.replace('[', '').replace(']', '')];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return newObject;
};

var getObjectProperty = function getObjectProperty(object, key) {
  try {
    var properties = key.split('.');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var property = _step2.value;

        var bracketNotation = property.match(/\[(.*?)]/g);
        if (bracketNotation) {
          object = getObjectFromBracketNotation(object, property, bracketNotation);
        } else {
          object = object[(0, _camelcase2.default)(property)];
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return object;
  } catch (err) {
    return null;
  }
};

exports.default = getObjectProperty;