import { assert } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import Runner from '../../src/lib/runner';
import readJsonFile from '../../src/lib/read-json-file';
import events from '../../src/data/events.json';

describe('Runner', () => {
  const basePath = `${process.cwd()}/test/unit/suite-data`;
  let runner;

  beforeEach(() => {
    runner = new Runner({ unescaped: false });
  });

  it('passes a simple test suite', (done) => {
    const definition = readJsonFile(`${basePath}/test-simple.json`);
    const reply = readJsonFile(`${basePath}/test-simple-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, reply);
    runner.run([definition])
      .then((results) => {
        assert.strictEqual(results[0].test1.pass, true);
        done();
      }).catch(done);
  });

  it('fails a test case', (done) => {
    const definition = readJsonFile(`${basePath}/test-simple.json`);
    const reply = readJsonFile(`${basePath}/test-simple-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(404, reply);
    runner.run([definition])
      .then((results) => {
        assert.strictEqual(results[0].test1.pass, false);
        done();
      }).catch(done);
  });

  it('fails a suite if suite definition is invalid', (done) => {
    runner.run([{}])
      .then((results) => {
        assert.strictEqual(results.pass, false);
        done();
      }).catch(done);
  });

  it('passes a test suite with depedencies', (done) => {
    const definition = readJsonFile(`${basePath}/test-complex.json`);
    const replyA = readJsonFile(`${basePath}/test-simple-res.json`);
    const replyB = readJsonFile(`${basePath}/test-complex-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, replyA)
      .get('/get?bar=bar')
      .reply(200, replyB);
    runner.run([definition])
      .then((results) => {
        assert.strictEqual(results[0].test1.pass, true);
        assert.strictEqual(results[0].test2.pass, true);
        done();
      }).catch(done);
  });

  it('fails a test case if a dependency has failed', (done) => {
    const definition = readJsonFile(`${basePath}/test-complex.json`);
    const replyA = readJsonFile(`${basePath}/test-simple-res.json`);
    const replyB = readJsonFile(`${basePath}/test-complex-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(404, replyA)
      .get('/get?bar=bar')
      .reply(200, replyB);
    runner.run([definition])
      .then((results) => {
        assert.strictEqual(results[0].test1.pass, false);
        assert.strictEqual(results[0].test2.pass, false);
        done();
      }).catch(done);
  });

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
      'ASSERTION_COUNT',
    ];
    const spies = [];
    for (const event of standardEvents) {
      const spy = sinon.spy();
      runner.on(events[event], spy);
      spies.push(spy);
    }

    const definition = readJsonFile(`${basePath}/test-simple.json`);
    const reply = readJsonFile(`${basePath}/test-simple-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, reply);
    runner.run([definition])
      .then(() => {
        for (const spy of spies) {
          sinon.assert.called(spy);
        }
        done();
      }).catch(done);
  });

  it('emits test failing events', (done) => {
    const spy = sinon.spy();
    runner.on(events.SUITE_TEST_FAIL, spy);

    const definition = readJsonFile(`${basePath}/test-simple.json`);
    const reply = readJsonFile(`${basePath}/test-simple-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(404, reply);
    runner.run([definition])
      .then(() => {
        sinon.assert.called(spy);
        done();
      }).catch(done);
  });

  it('emits suite failed event', (done) => {
    const standardEvents = [
      'FAIL',
      'SUITE_FAIL',
    ];
    const spies = [];
    for (const event of standardEvents) {
      const spy = sinon.spy();
      runner.on(events[event], spy);
      spies.push(spy);
    }

    runner.run([{}])
      .then(() => {
        for (const spy of spies) {
          sinon.assert.called(spy);
        }
        done();
      }).catch(done);
  });
});
