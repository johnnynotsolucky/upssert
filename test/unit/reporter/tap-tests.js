/* eslint-disable no-undef, import/no-extraneous-dependencies */
import { assert } from 'chai';
import sinon from 'sinon';
import Runner from '../mocks/runner';
import TapReporter from '../../../src/lib/reporter/tap';
import LogWriter from '../../../src/lib/writer/log';
import events from '../../../src/data/events.json';

sinon.assert.expose(assert, { prefix: '' });

describe('TAP Reporter', () => {
  let runner;
  let tap;
  let writer;
  beforeEach(() => {
    runner = new Runner();
    writer = new LogWriter();
    tap = new TapReporter();
    tap.setRunner(runner);
    tap.setWriter(writer);
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
      sinon.assert.calledWith(writer.out, '%d..%d', 1, 9);
      assert.equal(tap.stepCount, 9);
      done();
    });
    runner.suiteStepCount(9);
    runner.start();
  });

  it('should output Bail out! when a suite fails', (done) => {
    runner.on(events.SUITE_FAIL, (obj, err) => {
      sinon.assert.calledOnce(writer.out);
      sinon.assert.calledWith(writer.out, 'Bail out! %s', err.message);
      assert.equal(tap.bail, true);
      done();
    });
    runner.suiteFail(null, { message: 'Suite failed' });
    runner.start();
  });

  it('should not output anything after a suite has failed', (done) => {
    runner.on(events.END, () => {
      sinon.assert.calledOnce(writer.out);
      sinon.assert.calledWith(writer.out, 'Bail out! %s', '');
      done();
    });
    runner.suiteFail(null, { message: '' });
    runner.start();
    runner.suiteStepPass();
    runner.suiteStepFail();
    runner.end();
  });

  it('should report the stack trace when a step has failed', (done) => {
    runner.on(events.SUITE_STEP_FAIL, () => {
      sinon.assert.calledOnce(writer.lines);
      const out = [
        'not ok 1 foo',
        '  foobar',
      ];
      sinon.assert.calledWith(writer.lines, ...out);
      done();
    });
    runner.suiteStepStart();
    runner.suiteStepFail({ name: 'foo' }, { message: 'bar', stack: 'foobar' });
  });

  it('should increment counts', (done) => {
    runner.on(events.END, () => {
      assert.equal(tap.tests, 6);
      assert.equal(tap.stepCount, 6);
      assert.equal(tap.assertionCount, 18);
      assert.equal(tap.passes, 3);
      assert.equal(tap.fails, 3);
      done();
    });
    runner.suiteStepCount(6);
    runner.suiteAssertionCount(6 * 3);
    runner.start();
    const step = { name: 'step' };
    for (let i = 0; i < 3; i++) {
      runner.suiteStepStart();
      runner.suiteStepPass(step);
      runner.suiteStepStart();
      runner.suiteStepFail(step, { stack: '' });
    }
    runner.end();
  });

  it('should output the correct counts when the runner ends', (done) => {
    runner.on(events.END, () => {
      sinon.assert.calledOnce(writer.lines);
      const out = [
        '# tests 6',
        '# pass 3',
        '# fail 3',
        '# assertions 18',
      ];
      sinon.assert.calledWith(writer.lines, ...out);
      done();
    });
    tap.stepCount = 6;
    tap.assertionCount = 18;
    tap.passes = 3;
    tap.fails = 3;
    runner.end();
  });
});
