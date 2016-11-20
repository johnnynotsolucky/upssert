/* eslint-disable no-undef, import/no-extraneous-dependencies */
import { assert } from 'chai';
import stat from '../../../src/lib/http/stat';
import readJsonFile from '../../../src/bin/read-json-file'

const assertHttpStat = (statd) => {
  assert.isOk(statd);
  assert.strictEqual(statd.statusCode, 200);
  assert.strictEqual(statd.contentType, 'application/json');
  assert.strictEqual(statd.contentLength, 100);
  const timing = statd.timing;
  assert.isOk(timing);
  assert.strictEqual(timing.dnsResolution, 50);
  assert.strictEqual(timing.tcpConnection, 80);
  assert.strictEqual(timing.serverProcessing, 100);
  assert.strictEqual(timing.contentTransfer, 40);
  assert.strictEqual(timing.nameLookup, 50);
  assert.strictEqual(timing.connect, 130);
  assert.strictEqual(timing.startTransfer, 230);
  assert.strictEqual(timing.total, 270);
  const headers = statd.headers;
  assert.isOk(headers);
  assert.strictEqual(headers.contentType, 'application/json');
  assert.strictEqual(headers.contentLength, '100');
  assert.strictEqual(headers.xFooBar, 'foobar');
  const body = statd.body;
  assert.isOk(body);
  assert.strictEqual(body.foo, 'bar');
}

describe('stat', () => {
  it('should correctly calculate HTTP protocol timings and other meta data', () => {
    const data = readJsonFile('./test/unit/http/data/result-http.json');
    const statd = stat(data);
    assertHttpStat(statd);
  });

  it('should correctly calculate unknown protocol timings and other meta data', () => {
    const data = readJsonFile('./test/unit/http/data/result-unknown.json');
    const statd = stat(data);
    assertHttpStat(statd);
  });

  it('should correctly calculate HTTPS protocol timings and other meta data', () => {
    const data = readJsonFile('./test/unit/http/data/result-https.json');
    const statd = stat(data);
    assert.isOk(statd);
    assert.strictEqual(statd.statusCode, 200);
    assert.strictEqual(statd.contentType, 'application/json');
    assert.strictEqual(statd.contentLength, 100);
    const timing = statd.timing;
    assert.isOk(timing);
    assert.strictEqual(timing.dnsResolution, 50);
    assert.strictEqual(timing.tcpConnection, 80);
    assert.strictEqual(timing.tlsConnection, 100);
    assert.strictEqual(timing.serverProcessing, 150);
    assert.strictEqual(timing.contentTransfer, 40);
    assert.strictEqual(timing.nameLookup, 50);
    assert.strictEqual(timing.connect, 130);
    assert.strictEqual(timing.pretransfer, 230);
    assert.strictEqual(timing.startTransfer, 380);
    assert.strictEqual(timing.total, 420);
    const headers = statd.headers;
    assert.isOk(headers);
    assert.strictEqual(headers.contentType, 'application/json');
    assert.strictEqual(headers.contentLength, '100');
    assert.strictEqual(headers.xFooBar, 'foobar');
    const body = statd.body;
    assert.isOk(body);
    assert.strictEqual(body.foo, 'bar');
  });
});
