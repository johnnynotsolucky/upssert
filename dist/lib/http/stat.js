'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _factory = require('../parser/factory');

var _factory2 = _interopRequireDefault(_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUrlProtocol = function getUrlProtocol(url) {
  var protocol = url.protocol.replace(/:/, '');
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
  Object.keys(responseHeaders).forEach(function (field) {
    headers[(0, _camelcase2.default)(field)] = responseHeaders[field];
  });
  return headers;
};

var getContentPropertiesIfApplicable = function getContentPropertiesIfApplicable(headers) {
  var contentType = '';
  if (headers.contentType) {
    contentType = headers.contentType;
  }
  var contentLength = 0;
  if (headers.contentLength) {
    contentLength = parseInt(headers.contentLength, 10);
    if (isNaN(contentLength)) {
      contentLength = 0;
    }
  }
  return {
    contentType: contentType,
    contentLength: contentLength
  };
};

exports.default = function (result) {
  var protocol = getUrlProtocol(result.url);
  var responseTimes = calculateResponseTimesByProtocol(protocol, result.time);
  var headers = populateHeaders(result.response.headers);
  var contentProperties = getContentPropertiesIfApplicable(headers);
  var contentType = contentProperties.contentType,
      contentLength = contentProperties.contentLength;

  var parser = (0, _factory2.default)(contentType);
  var body = parser(result.response.body);

  return {
    statusCode: result.response.statusCode,
    contentType: contentType,
    contentLength: contentLength,
    timing: responseTimes,
    headers: headers,
    body: body
  };
};