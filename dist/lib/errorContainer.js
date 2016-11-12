'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorContainer = function (_Error) {
  _inherits(ErrorContainer, _Error);

  function ErrorContainer(errors) {
    _classCallCheck(this, ErrorContainer);

    var _this = _possibleConstructorReturn(this, (ErrorContainer.__proto__ || Object.getPrototypeOf(ErrorContainer)).call(this));

    _this.name = 'ErrorContainer';
    _this.message = '';
    _this.errors = errors;
    return _this;
  }

  return ErrorContainer;
}(Error);

exports.default = ErrorContainer;