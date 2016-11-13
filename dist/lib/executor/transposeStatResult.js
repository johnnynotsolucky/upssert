'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _parserFactory = require('../parser/parserFactory');

var _parserFactory2 = _interopRequireDefault(_parserFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (result) {
  var url = result.url;
  url.protocol = url.protocol.replace(/:/, '');

  var responseTimes = void 0;
  switch (url.protocol) {
    case 'http':
      responseTimes = calculateResponseTimes(result.time);
      break;
    case 'https':
      responseTimes = calculateTlsResponseTimes(result.time);
      break;
  }

  var headers = {};
  var headerFields = [];
  for (var field in result.response.headers) {
    headers[(0, _camelcase2.default)(field)] = result.response.headers[field];
    headerFields.push(field);
  };

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

  var parser = (0, _parserFactory2.default)(contentType);
  var body = parser.parse(result.response.body);

  return {
    statusCode: result.response.statusCode,
    contentType: contentType,
    contentLength: contentLength,
    timing: responseTimes,
    headers: headers,
    headerFields: headerFields,
    body: body
  };
};

var calculateResponseTimes = function calculateResponseTimes(times) {
  return {
    dnsResolution: times.onLookup - times.begin,
    tcpConnection: times.onConnect - times.onLookup,
    serverProcessing: times.onTransfer - times.onConnect,
    contentTransfer: times.onTotal - times.onTransfer,
    nameLookup: times.onLookup - times.begin,
    connect: times.onConnect - times.begin,
    startTransfer: times.onTransfer - times.begin,
    total: times.onTotal - times.begin
  };
};

var calculateTlsResponseTimes = function calculateTlsResponseTimes(times) {
  return {
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
};