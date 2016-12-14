'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render = require('../util/render');

var _render2 = _interopRequireDefault(_render);

var _generateToken = require('../util/generate-token');

var _generateToken2 = _interopRequireDefault(_generateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpRequest = function () {
  function HttpRequest(request, model, config) {
    _classCallCheck(this, HttpRequest);

    this.model = model;
    this.initialize(request);
    this.unescaped = config && config.unescaped;
  }

  _createClass(HttpRequest, [{
    key: 'initialize',
    value: function initialize(request) {
      this.url = this.renderUrl(request.url);
      this.method = this.renderRequestMethod(request.method);
      this.form = this.renderFormData(request);
      this.data = this.renderData(request);
      this.headers = this.renderRequestHeaders(request);
      this.trace = this.addTraceHeader();
    }
  }, {
    key: 'renderUrl',
    value: function renderUrl(url) {
      var result = void 0;
      if (url) {
        result = (0, _render2.default)(url, this.model, this.unescaped);
      }
      return result;
    }
  }, {
    key: 'renderRequestMethod',
    value: function renderRequestMethod(method) {
      var result = void 0;
      if (method) {
        result = (0, _render2.default)(method, this.model, this.unescaped);
      } else {
        result = 'GET';
      }
      return result;
    }
  }, {
    key: 'renderFormData',
    value: function renderFormData(request) {
      var form = void 0;
      if (request.form) {
        form = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = request.form[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            var renderedKey = (0, _render2.default)(item.key, this.model, this.unescaped);
            var renderedValue = (0, _render2.default)(item.value, this.model, this.unescaped);
            var formItem = renderedKey + '=' + renderedValue;
            form.push(formItem);
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
      }
      return form;
    }
  }, {
    key: 'renderData',
    value: function renderData(request) {
      var data = void 0;
      if (request.data) {
        if (typeof request.data === 'string') {
          data = request.data;
        } else if (_typeof(request.data) === 'object') {
          data = this.renderDataFromObject(request.data);
        }
        data = (0, _render2.default)(data, this.model, this.unescaped);
      }
      return data;
    }
  }, {
    key: 'renderDataFromObject',
    value: function renderDataFromObject(obj) {
      var rendered = '';
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          if (obj[key] && typeof obj[key] === 'string') {
            var part = key + '=' + obj[key];
            rendered = rendered + '&' + part;
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

      return rendered.substr(1);
    }
  }, {
    key: 'renderRequestHeaders',
    value: function renderRequestHeaders(request) {
      var _this = this;

      var headers = [];
      if (request.headers) {
        Object.keys(request.headers).forEach(function (key) {
          var value = request.headers[key];
          var concatenated = key + ': ' + (0, _render2.default)(value, _this.model, _this.unescaped);
          headers.push(concatenated);
        });
      }
      return headers;
    }
  }, {
    key: 'addTraceHeader',
    value: function addTraceHeader() {
      var token = (0, _generateToken2.default)();
      this.headers.push('X-Upssert-Trace: ' + token);
      return token;
    }
  }]);

  return HttpRequest;
}();

exports.default = HttpRequest;