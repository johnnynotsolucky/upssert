'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _contentType = require('content-type');

var _contentType2 = _interopRequireDefault(_contentType);

var _factory = require('../parser/factory');

var _factory2 = _interopRequireDefault(_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUrlProtocol = function getUrlProtocol(url) {
  var protocol = void 0;
  if (url && url.protocol) {
    protocol = url.protocol.replace(/:/, '');
  }
  return protocol;
};

var calculateResponseTimes = function calculateResponseTimes(times) {
  var calculated = {
    dnsResolution: times.onLookup - times.begin,
    tcpConnection: times.onConnect - times.onLookup,
    serverProcessing: times.onTransfer - times.onConnect,
    contentTransfer: times.onTotal - times.onTransfer,
    nameLookup: times.onLookup - times.begin,
    connect: times.onConnect - times.begin,
    startTransfer: times.onTransfer - times.begin,
    total: times.onTotal - times.begin
  };
  return calculated;
};

var calculateTlsResponseTimes = function calculateTlsResponseTimes(times) {
  var calculated = {
    dnsResolution: times.onLookup - times.begin,
    tcpConnection: times.onConnect - times.onLookup,
    tlsConnection: times.onSecureConnect - times.onConnect,
    serverProcessing: times.onTransfer - times.onSecureConnect,
    contentTransfer: times.onTotal - times.onTransfer,
    nameLookup: times.onLookup - times.begin,
    connect: times.onConnect - times.begin,
    pretransfer: times.onSecureConnect - times.begin,
    startTransfer: times.onTransfer - times.begin,
    total: times.onTotal - times.begin
  };
  return calculated;
};

var calculateResponseTimesByProtocol = function calculateResponseTimesByProtocol(protocol, times) {
  var responseTimes = void 0;
  switch (protocol) {
    case 'https':
      responseTimes = calculateTlsResponseTimes(times);
      break;
    case 'http':
    default:
      responseTimes = calculateResponseTimes(times);
  }
  return responseTimes;
};

var populateHeaders = function populateHeaders(responseHeaders) {
  var headers = {};
  if (responseHeaders) {
    Object.keys(responseHeaders).forEach(function (field) {
      headers[(0, _camelcase2.default)(field)] = responseHeaders[field];
    });
  }
  return headers;
};

var getContentPropertiesIfApplicable = function getContentPropertiesIfApplicable(headers) {
  var result = {
    type: '',
    charset: 'utf-8',
    contentLength: 0
  };
  if (headers.contentType) {
    var parsed = _contentType2.default.parse(headers.contentType);
    result.type = parsed.type || '';
    result.charset = parsed.parameters.charset || 'utf-8';
  }
  if (headers.contentLength) {
    var value = parseInt(headers.contentLength, 10);
    if (!isNaN(value)) {
      result.contentLength = value;
    }
  }
  return result;
};

exports.default = function (result) {
  var statusCode = result.response.statusCode;
  var protocol = getUrlProtocol(result.url);
  var timing = calculateResponseTimesByProtocol(protocol, result.time);
  var headers = populateHeaders(result.response.headers);
  var contentProperties = getContentPropertiesIfApplicable(headers);
  var type = contentProperties.type,
      contentLength = contentProperties.contentLength;

  var parser = (0, _factory2.default)(type);
  var body = parser(result.response.body);

  var transposed = {
    statusCode: statusCode,
    contentType: type,
    contentLength: contentLength,
    timing: timing,
    headers: headers,
    body: body
  };
  return transposed;
};