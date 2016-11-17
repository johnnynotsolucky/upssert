import camelcase from 'camelcase';
import parserFactory from './parser/factory';

const calculateResponseTimes = (times) => {
  const calculated = {
    dnsResolution: times.onLookup - times.begin,
    tcpConnection: times.onConnect - times.onLookup,
    serverProcessing: times.onTransfer - times.onConnect,
    contentTransfer: times.onTotal - times.onTransfer,
    nameLookup: times.onLookup - times.begin,
    connect: times.onConnect - times.begin,
    startTransfer: times.onTransfer - times.begin,
    total: times.onTotal - times.begin,
  };
  return calculated;
};

const calculateTlsResponseTimes = (times) => {
  const calculated = {
    dnsResolution: times.onLookup - times.begin,
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
  return calculated;
};

export default (result) => {
  const url = result.url;
  url.protocol = url.protocol.replace(/:/, '');

  let responseTimes;
  switch (url.protocol) {
    case 'https':
      responseTimes = calculateTlsResponseTimes(result.time);
      break;
    case 'http':
    default:
      responseTimes = calculateResponseTimes(result.time);
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
  const body = parser(result.response.body);

  return {
    statusCode: result.response.statusCode,
    contentType,
    contentLength,
    timing: responseTimes,
    headers,
    headerFields,
    body,
  };
};
