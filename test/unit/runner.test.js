import { assert } from 'chai';
import nock from 'nock';
import Runner from '../../src/lib/runner';
import readJsonFile from '../../src/lib/read-json-file';

describe('Runner', () => {
  const basePath = `${process.cwd()}/test/unit/suite-data`;
  let runner;

  beforeEach(() => {
    runner = new Runner({ unescaped: false });
  });

  it('successfully runs a simple test suite', (done) => {
    const definition = readJsonFile(`${basePath}/test-simple.json`);
    const reply = readJsonFile(`${basePath}/test-simple-res.json`);
    nock('https://httpbin.org')
      .get('/get?foo=bar')
      .reply(200, reply, {
        'Content-Type': 'application/json',
      });
    runner.run([definition])
      .then((results) => {
        assert.strictEqual(results[0].results.test1.pass, true);
        done();
      });
  });
});
