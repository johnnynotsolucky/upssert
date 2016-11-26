import { assert } from 'chai';
import sinon from 'sinon';
import 'colors';
import Runner from '../mocks/runner';
import ConsoleReporter from '../../../src/lib/reporter/console';
import LogWriter from '../../../src/lib/writer/log';
import events from '../../../src/data/events.json';

sinon.assert.expose(assert, { prefix: '' });

describe('Console Reporter', () => {
  let runner;
  let console;
  let writer;
  beforeEach(() => {
    runner = new Runner();
    writer = new LogWriter();
    console = new ConsoleReporter();
    console.setEventEmitter(runner);
    console.setWriter(writer);
    sinon.stub(writer, 'out');
    sinon.stub(writer, 'lines');
  });

  afterEach(() => {
    writer.out.restore();
    writer.lines.restore();
  });

  it('should output the correct test count when the runner starts', (done) => {
    runner.on(events.START, () => {
      sinon.assert.calledOnce(writer.out);
      sinon.assert.calledWith(writer.out,
        '\n  Executing 3 test suites (9 assertions)…'.grey);
      assert.equal(console.suiteCount, 3);
      assert.equal(console.assertionCount, 9);
      done();
    });
    runner.suiteCount(3);
    runner.suiteAssertionCount(9);
    runner.start();
  });

  it('should output suite name when the suite starts', (done) => {
    runner.on(events.SUITE_START, () => {
      sinon.assert.calledOnce(writer.out);
      sinon.assert.calledWith(writer.out, '\n  foobar'.white);
      done();
    });
    runner.suiteStart({ name: 'foobar' });
  });

  it('should output suite name and error message when a suite fails', (done) => {
    runner.on(events.SUITE_FAIL, () => {
      sinon.assert.calledOnce(writer.lines);
      sinon.assert.calledWith(writer.lines,
        '✖ foobar'.red,
        'Suite failed');
      assert.equal(console.bail, true);
      done();
    });
    runner.suiteFail({ name: 'foobar' }, { message: 'Suite failed' });
    runner.start();
  });

  it('should not output anything after a suite has failed', (done) => {
    runner.on(events.END, () => {
      sinon.assert.calledOnce(writer.lines);
      done();
    });
    runner.suiteFail({ name: 'foobar' }, { message: '' });
    runner.start();
    runner.suiteTestPass();
    runner.suiteTestFail();
    runner.end();
  });

  it('should report the error message when a test has failed', (done) => {
    runner.on(events.SUITE_TEST_FAIL, () => {
      sinon.assert.calledOnce(writer.out);
      sinon.assert.calledWith(writer.out, '    ✖ foo'.red);
      done();
    });
    runner.suiteTestStart();
    runner.suiteTestFail({ name: 'foo' }, { message: 'bar' });
  });

  it('should increment counts', (done) => {
    runner.on(events.END, () => {
      assert.equal(console.tests, 6);
      assert.equal(console.testCount, 6);
      assert.equal(console.assertionCount, 18);
      assert.equal(console.passes, 3);
      assert.equal(console.fails, 3);
      done();
    });
    runner.suiteTestCount(6);
    runner.suiteAssertionCount(6 * 3);
    runner.start();
    const test = { name: 'test' };
    for (let i = 0; i < 3; i++) {
      runner.suiteTestStart();
      runner.suiteTestPass(test);
      runner.suiteTestStart();
      runner.suiteTestFail(test, { });
    }
    runner.end();
  });

  it('should output the correct counts when the runner ends', (done) => {
    runner.on(events.END, () => {
      sinon.assert.calledThrice(writer.lines);
      const one = [
        '',
        `  1) ${'foo'.red}`,
        '  Error: bar'.white,
      ];
      const two = [
        '',
        `  2) ${'foobar'.red}`,
        '  Error: foobar'.white,
      ];
      const three = [
        '',
        /.*3.*/, // XXX Is there a better way to match the full string with color?
        '  2 failing'.red,
        '',
      ];
      sinon.assert.calledWith(writer.lines.firstCall, ...one);
      sinon.assert.calledWith(writer.lines.secondCall, ...two);
      sinon.assert.calledWithMatch(writer.lines.thirdCall, ...three);
      done();
    });
    console.testCount = 6;
    console.assertionCount = 18;
    console.passes = 3;
    runner.suiteTestFail({ name: 'foo' }, { message: 'bar' });
    runner.suiteTestFail({ name: 'foobar' }, { message: 'foobar' });
    writer.lines.restore();
    sinon.stub(writer, 'lines');
    runner.end();
  });
});
