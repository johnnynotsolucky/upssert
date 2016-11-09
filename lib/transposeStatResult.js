const camelcase = require('camelcase');
const parserFactory = require('./parser/parserFactory');

const transpose = (result) => {
  const url = result.url;
  url.protocol = url.protocol.replace(/:/, '');

  let responseTimes;
  switch (url.protocol) {
    case 'http':
      responseTimes = calculateResponseTimes(result.time);
      break;
    case 'https':
      responseTimes = calculateTlsResponseTimes(result.time);
      break;
  }

  const headers = {};
  const headerFields = [];
  Object.keys(result.response.headers).forEach((field) => {
    headers[camelcase(field)] = result.response.headers[field];
    headerFields.push(field);
  });

  let contentType = '';
  if (headers.contentType) {
    contentType = headers.contentType;
  }

  let contentLength = 0;
  if (headers.contentLength) {
    contentLength = parseInt(headers.contentLength, 10);
    if (isNaN(contentLength)) {
      contentLength = 0;
    }
  }

  const parser = parserFactory(contentType);
  const body = parser.parse(result.response.body);

  return {
    code: result.response.statusCode,
    contentType,
    contentLength,
    timing: responseTimes,
    headers,
    headerFields,
    body,
  };
};

const calculateResponseTimes = (times) => {
  return {
    dnsResolve: times.onLookup - times.begin,
    tcpConnection: times.onConnect - times.onLookup,
    serverProcessing: times.onTransfer - times.onConnect,
    contentTransfer: times.onTotal - times.onTransfer,
    nameLookup: times.onLookup - times.begin,
    connect: times.onConnect - times.begin,
    startTransfer: times.onTransfer - times.begin,
    total: times.onTotal - times.begin,
  };
};

const calculateTlsResponseTimes = (times) => {
  return {
    dnsResolve: times.onLookup - times.begin,
    tcpConnection: times.onConnect - times.onLookup,
    tlsConnection: times.onSecureConnect - times.onConnect,
    serverProcessing: times.onTransfer - times.onSecureConnect,
    contentTransfer: times.onTotal - times.onTransfer,
    nameLookup: times.onLookup - times.begin,
    connect: times.onConnect - times.begin,
    pretransfer: times.onSecureConnect - times.begin,
    startTransfer: times.onTransfer - times.begin,
    total: times.onTotal - times.begin,
  };
};

module.exports = transpose;