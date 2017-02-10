import {
  map,
  tryCatch,
  toPairs,
  fromPairs,
  curry,
  either,
  compose,
  replace,
  prop
} from 'ramda'
import camelcase from 'camelcase'
import contentType from 'content-type'
import parserFactory from '../parser/factory'
import { identityOrDefault, toInt, applyHead } from '../util/functional-utils'

// getUrlProtocol :: a -> String
const getUrlProtocol =
  compose(replace(/:/, ''), identityOrDefault(''), prop('protocol'), identityOrDefault({}))

const calculateResponseTimes = curry((times, _) => ({
  dnsResolution: times.onLookup - times.begin,
  tcpConnection: times.onConnect - times.onLookup,
  serverProcessing: times.onTransfer - times.onConnect,
  contentTransfer: times.onTotal - times.onTransfer,
  nameLookup: times.onLookup - times.begin,
  connect: times.onConnect - times.begin,
  startTransfer: times.onTransfer - times.begin,
  total: times.onTotal - times.begin
}))

const calculateTlsResponseTimes = curry((times, protocol) =>
  protocol === 'https' ? {
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
  } : null)

// calculateResponseTimesByProtocol :: String -> Object -> Object
const calculateResponseTimesByProtocol = curry((protocol, times) =>
  either(calculateTlsResponseTimes(times), calculateResponseTimes(times))(protocol))

// populateHeaders :: a -> b
const populateHeaders = compose(fromPairs, map(applyHead(camelcase)), toPairs)

// parseContentType :: a -> String
const parseContentType =
  compose(
    identityOrDefault(''),
    prop('type'),
    tryCatch(contentType.parse, () => ({})),
    prop('contentType')
  )

// parseContentLength :: a -> Integer
const parseContentLength =
  compose(
    x => !isNaN(x) ? x : 0,
    toInt(10),
    identityOrDefault(''),
    prop('contentLength')
  )

// getContentProperties :: a -> b
const getContentProperties = (headers) => ({
  type: parseContentType(headers),
  contentLength: parseContentLength(headers)
})

export default (result) => {
  const statusCode = result.response.statusCode
  const protocol = getUrlProtocol(result.url)
  const timing = calculateResponseTimesByProtocol(protocol, result.time)
  const headers = populateHeaders(result.response.headers)
  const contentProperties = getContentProperties(headers)
  const { type, contentLength } = contentProperties
  const parser = parserFactory(type)
  const body = parser(result.response.body)

  const transposed = {
    statusCode,
    contentType: type,
    contentLength,
    timing,
    headers,
    body
  }
  return transposed
}
