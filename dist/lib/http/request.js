'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render = require('../util/render');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpRequest = function () {
  function HttpRequest(request, model) {
    _classCallCheck(this, HttpRequest);

    this.model = model;
    this.initialize(request);
  }

  _createClass(HttpRequest, [{
    key: 'initialize',
    value: function initialize(request) {
      this.url = this.renderUrl(request.url);
      this.method = this.renderRequestMethod(request.method);
      this.form = this.renderFormData(request);
      this.data = this.renderData(request);
      this.headers = this.renderRequestHeaders(request);
    }
  }, {
    key: 'renderUrl',
    value: function renderUrl(url) {
      var result = void 0;
      if (url) {
        result = (0, _render2.default)(url, this.model);
      }
      return result;
    }
  }, {
    key: 'renderRequestMethod',
    value: function renderRequestMethod(method) {
      var result = void 0;
      if (method) {
        result = (0, _render2.default)(method, this.model);
      } else {
        result = 'GET';
      }
      return result;
    }
  }, {
    key: 'renderFormData',
    value: function renderFormData(request) {
      var _this = this;

      var form = void 0;
      if (request.form) {
        form = [];
        request.form.forEach(function (item) {
          var renderedKey = (0, _render2.default)(item.key, _this.model);
          var renderedValue = (0, _render2.default)(item.value, _this.model);
          var formItem = renderedKey + '=' + renderedValue;
          form.push(formItem);
        });
      }
      return form;
    }
  }, {
    key: 'renderData',
    value: function renderData(request) {
      var data = void 0;
      if (request.data) {
        data = (0, _render2.default)(request.data, this.model);
      }
      return data;
    }
  }, {
    key: 'renderRequestHeaders',
    value: function renderRequestHeaders(request) {
      var _this2 = this;

      var headers = [];
      if (request.headers) {
        Object.keys(request.headers).forEach(function (key) {
          var value = request.headers[key];
          var concatenated = key + ': ' + (0, _render2.default)(value, _this2.model);
          headers.push(concatenated);
        });
      }
      return headers;
    }
  }]);

  return HttpRequest;
}();

exports.default = HttpRequest;