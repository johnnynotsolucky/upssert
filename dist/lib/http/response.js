'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _contentType = require('content-type');

var _contentType2 = _interopRequireDefault(_contentType);

var _factory = require('../parser/factory');

var _factory2 = _interopRequireDefault(_factory);

var _functionalUtils = require('../util/functional-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// getUrlProtocol :: a -> String
var getUrlProtocol = (0, _ramda.compose)((0, _ramda.replace)(/:/, ''), (0, _functionalUtils.identityOrDefault)(''), (0, _ramda.prop)('protocol'), (0, _functionalUtils.identityOrDefault)({}));

var calculateResponseTimes = (0, _ramda.curry)(function (times, _) {
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
});

var calculateTlsResponseTimes = (0, _ramda.curry)(function (times, protocol) {
  return protocol === 'https' ? {
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
  } : null;
});

// calculateResponseTimesByProtocol :: String -> Object -> Object
var calculateResponseTimesByProtocol = (0, _ramda.curry)(function (protocol, times) {
  return (0, _ramda.either)(calculateTlsResponseTimes(times), calculateResponseTimes(times))(protocol);
});

// populateHeaders :: a -> b
var populateHeaders = (0, _ramda.compose)(_ramda.fromPairs, (0, _ramda.map)((0, _functionalUtils.applyHead)(_camelcase2.default)), _ramda.toPairs);

// parseContentType :: a -> String
var parseContentType = (0, _ramda.compose)((0, _functionalUtils.identityOrDefault)(''), (0, _ramda.prop)('type'), (0, _ramda.tryCatch)(_contentType2.default.parse, function () {
  return {};
}), (0, _ramda.prop)('contentType'));

// parseContentLength :: a -> Integer
var parseContentLength = (0, _ramda.compose)(function (x) {
  return !isNaN(x) ? x : 0;
}, (0, _functionalUtils.toInt)(10), (0, _functionalUtils.identityOrDefault)(''), (0, _ramda.prop)('contentLength'));

// getContentProperties :: a -> b
var getContentProperties = function getContentProperties(headers) {
  return {
    type: parseContentType(headers),
    contentLength: parseContentLength(headers)
  };
};

exports.default = function (result) {
  var statusCode = result.response.statusCode;
  var protocol = getUrlProtocol(result.url);
  var timing = calculateResponseTimesByProtocol(protocol, result.time);
  var headers = populateHeaders(result.response.headers);
  var contentProperties = getContentProperties(headers);
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