import camelcase from 'camelcase';
import parserFactory from '../parser/factory';

const getUrlProtocol = (url) => {
  let protocol;
  if (url && url.protocol) {
    protocol = url.protocol.replace(/:/, '');
  }
  return protocol;
};

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

const calculateResponseTimesByProtocol = (protocol, times) => {
  let responseTimes;
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

const populateHeaders = (responseHeaders) => {
  const headers = {};
  Object.keys(responseHeaders).forEach((field) => {
    headers[camelcase(field)] = responseHeaders[field];
  });
  return headers;
};

const getContentPropertiesIfApplicable = (headers) => {
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
  return {
    contentType,
    contentLength,
  };
};

export default (result) => {
  const statusCode = result.response.statusCode;
  const protocol = getUrlProtocol(result.url);
  const timing = calculateResponseTimesByProtocol(protocol, result.time);
  const headers = populateHeaders(result.response.headers);
  const contentProperties = getContentPropertiesIfApplicable(headers);
  const { contentType, contentLength } = contentProperties;
  const parser = parserFactory(contentType);
  const body = parser(result.response.body);

  return {
    statusCode,
    contentType,
    contentLength,
    timing,
    headers,
    body,
  };
};
