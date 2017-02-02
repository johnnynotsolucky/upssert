import { assert } from 'chai'
import { formatResponse } from '../../../src/lib/http'
import { readJsonFile } from '../../../src/lib/util/json'

describe('formatResponse', () => {
  it('should correctly calculate HTTP protocol timings and other meta data', () => {
    const data = readJsonFile('./test/unit/http/data/result-http.json').value
    const response = formatResponse(data)
    assert.isOk(response)
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.contentType, 'application/json')
    assert.strictEqual(response.contentLength, 100)
    const timing = response.timing
    assert.isOk(timing)
    assert.strictEqual(timing.dnsResolution, 50)
    assert.strictEqual(timing.tcpConnection, 80)
    assert.isNotOk(timing.tlsConnection)
    assert.strictEqual(timing.serverProcessing, 100)
    assert.strictEqual(timing.contentTransfer, 40)
    assert.strictEqual(timing.nameLookup, 50)
    assert.strictEqual(timing.connect, 130)
    assert.strictEqual(timing.startTransfer, 230)
    assert.strictEqual(timing.total, 270)
    const headers = response.headers
    assert.isOk(headers)
    assert.strictEqual(headers.contentType, 'application/json; charset=UTF-8')
    assert.strictEqual(headers.contentLength, '100')
    assert.strictEqual(headers.xFooBar.match, 'foobar')
    assert.strictEqual(headers.xFooBar['not-match'], 'bar')
    const body = response.body
    assert.isOk(body)
    assert.strictEqual(body.foo, 'bar')
  })

  it('should correctly calculate unknown protocol timings and other meta data', () => {
    const data = readJsonFile('./test/unit/http/data/result-unknown.json').value
    const stat = formatResponse(data)
    assert.isOk(stat)
    assert.strictEqual(stat.statusCode, 200)
    assert.strictEqual(stat.contentType, '')
    assert.strictEqual(stat.contentLength, 0)
    const timing = stat.timing
    assert.isOk(timing)
    assert.strictEqual(timing.dnsResolution, 50)
    assert.strictEqual(timing.tcpConnection, 80)
    assert.strictEqual(timing.serverProcessing, 100)
    assert.strictEqual(timing.contentTransfer, 40)
    assert.strictEqual(timing.nameLookup, 50)
    assert.strictEqual(timing.connect, 130)
    assert.strictEqual(timing.startTransfer, 230)
    assert.strictEqual(timing.total, 270)
    const headers = stat.headers
    assert.isOk(headers)
    assert.isNotOk(headers.contentType)
    assert.isNotOk(headers.contentLength)
    const body = stat.body
    assert.isOk(body)
    assert.strictEqual(body, '{"foo": "bar"}')
  })

  it('should correctly calculate HTTPS protocol timings and other meta data', () => {
    const data = readJsonFile('./test/unit/http/data/result-https.json').value
    const response = formatResponse(data)
    assert.isOk(response)
    assert.strictEqual(response.statusCode, 200)
    assert.strictEqual(response.contentType, 'application/json')
    assert.strictEqual(response.contentLength, 100)
    const timing = response.timing
    assert.isOk(timing)
    assert.strictEqual(timing.dnsResolution, 50)
    assert.strictEqual(timing.tcpConnection, 80)
    assert.strictEqual(timing.tlsConnection, 100)
    assert.strictEqual(timing.serverProcessing, 150)
    assert.strictEqual(timing.contentTransfer, 40)
    assert.strictEqual(timing.nameLookup, 50)
    assert.strictEqual(timing.connect, 130)
    assert.strictEqual(timing.pretransfer, 230)
    assert.strictEqual(timing.startTransfer, 380)
    assert.strictEqual(timing.total, 420)
    const headers = response.headers
    assert.isOk(headers)
    assert.strictEqual(headers.contentType, 'application/json')
    assert.strictEqual(headers.contentLength, '100')
    assert.strictEqual(headers.xFooBar, 'foobar')
    const body = response.body
    assert.isOk(body)
    assert.strictEqual(body.foo, 'bar')
  })
})
