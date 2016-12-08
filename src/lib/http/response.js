import camelcase from 'camelcase';
import contentType from 'content-type';
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
  if (responseHeaders) {
    Object.keys(responseHeaders).forEach((field) => {
      headers[camelcase(field)] = responseHeaders[field];
    });
  }
  return headers;
};

const getContentPropertiesIfApplicable = (headers) => {
  const result = {
    type: '',
    charset: 'utf-8',
    contentLength: 0,
  };
  if (headers.contentType) {
    const parsed = contentType.parse(headers.contentType);
    result.type = parsed.type || '';
    result.charset = parsed.parameters.charset || 'utf-8';
  }
  if (headers.contentLength) {
    const value = parseInt(headers.contentLength, 10);
    if (!isNaN(value)) {
      result.contentLength = value;
    }
  }
  return result;
};

export default (result) => {
  const statusCode = result.response.statusCode;
  const protocol = getUrlProtocol(result.url);
  const timing = calculateResponseTimesByProtocol(protocol, result.time);
  const headers = populateHeaders(result.response.headers);
  const contentProperties = getContentPropertiesIfApplicable(headers);
  const { type, contentLength } = contentProperties;
  const parser = parserFactory(type);
  const body = parser(result.response.body);

  const transposed = {
    statusCode,
    contentType: type,
    contentLength,
    timing,
    headers,
    body,
  };
  return transposed;
};
