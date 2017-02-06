import { assert } from 'chai'
import sinon from 'sinon'
import nock from 'nock'
import Runner from '../../src/lib/runner'
import { readJsonFile } from '../../src/lib/util/json'
import events from '../../src/data/events.json'

describe('Runner', () => {
  const basePath = `${process.cwd()}/test/unit/suite-data`
  let runner

  beforeEach(() => {
    runner = new Runner({
      unescaped: false
    })
  })

  it('passes a simple test suite', (done) => {
    const definition = readJsonFile(`${basePath}/test-simple.json`).value
    const reply = readJsonFile(`${basePath}/test-simple-res.json`).value
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, reply)
    runner.run([definition])
      .then((results) => {
        const test1 = results[0].tests.test1
        assert.strictEqual(test1.pass, true)
        assert.isNotOk(test1.reason)
        done()
      }).catch(done)
  })

  it('fails a test case', (done) => {
    const definition = readJsonFile(`${basePath}/test-simple.json`).value
    const reply = readJsonFile(`${basePath}/test-simple-res.json`).value
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(404, reply)
    runner.run([definition])
      .then((results) => {
        const test1 = results[0].tests.test1
        assert.strictEqual(test1.pass, false)
        assert.strictEqual(test1.reason, 'expected 404 to equal 200 (statusCode)')
        done()
      }).catch(done)
  })

  it('fails a suite if suite definition is invalid', (done) => {
    runner.run([{}])
      .then((results) => {
        assert.strictEqual(results.pass, false)
        assert.strictEqual(results.reason, '[/] Missing required property: name')
        done()
      }).catch(done)
  })

  it('passes a test suite with depedencies', (done) => {
    const definition = readJsonFile(`${basePath}/test-complex.json`).value
    const replyA = readJsonFile(`${basePath}/test-simple-res.json`).value
    const replyB = readJsonFile(`${basePath}/test-complex-res.json`).value
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, replyA)
      .get('/get?bar=bar')
      .reply(200, replyB)
    runner.run([definition])
      .then((results) => {
        const test1 = results[0].tests.test1
        const test2 = results[0].tests.test2
        assert.strictEqual(test1.pass, true)
        assert.isNotOk(test1.reason)
        assert.strictEqual(test2.pass, true)
        assert.isNotOk(test2.reason)
        done()
      }).catch(done)
  })

  it('fails a test case if a dependency has failed', (done) => {
    const definition = readJsonFile(`${basePath}/test-complex.json`).value
    const replyA = readJsonFile(`${basePath}/test-simple-res.json`).value
    const replyB = readJsonFile(`${basePath}/test-complex-res.json`).value
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(404, replyA)
      .get('/get?bar=bar')
      .reply(200, replyB)
    runner.run([definition])
      .then((results) => {
        const test1 = results[0].tests.test1
        const test2 = results[0].tests.test2
        assert.strictEqual(test1.pass, false)
        assert.strictEqual(test1.reason, 'expected 404 to be below 400 (statusCode)')
        assert.strictEqual(test2.pass, false)
        assert.strictEqual(test2.reason, 'Failed dependencies')
        done()
      }).catch(done)
  })

  it('emits all suite passing events', (done) => {
    const standardEvents = [
      'START',
      'END',
      'SUITE_START',
      'SUITE_END',
      'SUITE_TEST_START',
      'SUITE_TEST_END',
      'SUITE_TEST_PASS',
      'SUITE_COUNT',
      'TEST_COUNT',
      'ASSERTION_COUNT'
    ]
    const spies = []
    for (const event of standardEvents) {
      const spy = sinon.spy()
      runner.on(events[event], spy)
      spies.push(spy)
    }

    const definition = readJsonFile(`${basePath}/test-simple.json`).value
    const reply = readJsonFile(`${basePath}/test-simple-res.json`).value
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, reply)
    runner.run([definition])
      .then(() => {
        for (const spy of spies) {
          sinon.assert.called(spy)
        }
        done()
      }).catch(done)
  })

  it('emits test failing events', (done) => {
    const spy = sinon.spy()
    runner.on(events.SUITE_TEST_FAIL, spy)

    const definition = readJsonFile(`${basePath}/test-simple.json`).value
    const reply = readJsonFile(`${basePath}/test-simple-res.json`).value
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(404, reply)
    runner.run([definition])
      .then(() => {
        sinon.assert.called(spy)
        done()
      }).catch(done)
  })

  it('emits suite failed event', (done) => {
    const standardEvents = [
      'FAIL',
      'SUITE_FAIL'
    ]
    const spies = []
    for (const event of standardEvents) {
      const spy = sinon.spy()
      runner.on(events[event], spy)
      spies.push(spy)
    }

    runner.run([{}])
      .then(() => {
        for (const spy of spies) {
          sinon.assert.called(spy)
        }
        done()
      }).catch(done)
  })

  const url = 'https://httpbin.org/get'
  const metaDataRequest = {
    name: 'Ping',
    tests: [{
      name: url,
      request: {
        url
      }
    }]
  }

  it('returns suite meta-data if defined', (done) => {
    const definition = {
      ...metaDataRequest,
      meta: {
        foo: 'bar'
      }
    }
    nock('https://httpbin.org')
      .get('/get')
      .reply(200, {})
    runner.run([definition])
      .then((results) => {
        const meta = results[0].meta
        assert.strictEqual(meta.foo, 'bar')
        done()
      }).catch(done)
  })

  it('returns suite meta-data regardless of type', (done) => {
    const definition = {
      ...metaDataRequest,
      meta: 'foobar'
    }
    nock('https://httpbin.org')
      .get('/get')
      .reply(200, {})
    runner.run([definition])
      .then((results) => {
        const meta = results[0].meta
        assert.strictEqual(meta, 'foobar')
        done()
      }).catch(done)
  })

  it('returns suite meta-data if set to false', (done) => {
    const definition = {
      ...metaDataRequest,
      meta: false
    }
    nock('https://httpbin.org')
      .get('/get')
      .reply(200, {})
    runner.run([definition])
      .then((results) => {
        const meta = results[0].meta
        assert.strictEqual(meta, false)
        done()
      }).catch(done)
  })

  it('returns empty meta-data if none defined', (done) => {
    const definition = metaDataRequest
    nock('https://httpbin.org')
      .get('/get')
      .reply(200, {})
    runner.run([definition])
      .then((results) => {
        const meta = results[0].meta
        assert.isOk(meta)
        done()
      }).catch(done)
  })
})
