import { assert } from 'chai';
import sinon from 'sinon';
import Runner from '../mocks/runner.js';
import tapReporter from '../../../src/lib/reporter/tap';
import events from '../../../src/data/events.json';

sinon.assert.expose(assert, { prefix: "" });

describe('TAP Reporter', () => {
  let runner;
  let tap;
  beforeEach(function() {
    runner = new Runner();
    tap = tapReporter(runner);
    sinon.stub(tap.writer, 'out');
  });

  afterEach(function() {
    tap.writer.out.restore();
  });

  it('should output the correct test count when the runner starts', (done) => {
    runner.on(events.START, () => {
      sinon.assert.calledOnce(tap.writer.out);
      sinon.assert.calledWith(tap.writer.out, '%d..%d', 1, 9);
      assert.equal(tap.stepCount, 9);
      done();
    });
    runner.suiteStepCount(9);
    runner.start();
  });

  it('should output Bail out! when a suite fails', (done) => {
    runner.on(events.SUITE_FAIL, (obj, err) => {
      sinon.assert.calledOnce(tap.writer.out);
      sinon.assert.calledWith(tap.writer.out, 'Bail out! %s', err.message);
      assert.equal(tap.bail, true);
      done();
    });
    runner.suiteFail(null, { message: 'Suite failed' });
    runner.start();
  });

  // it('should not output anything after a suite has failed', (done) => {
  //   const tapEvents = [
  //     events.START,
  //     events.SUITE_STEP_PASS,
  //     events.SUITE_STEP_FAIL,
  //     events.END,
  //   ];

  //   const promises = [];
  //   for(const event of tapEvents) {
  //     runner.on(event, () => {
  //       promises.push(new Promise((resolve) => {
  //         sinon.assert.calledOnce(tap.writer.out);
  //         resolve();
  //       }));
  //     });
  //   }
  //   Promise.all(promises).then(() => done(), done);
  //   runner.suiteFail(null, { message: '' });
  //   runner.start();
  //   runner.suiteStepPass();
  //   runner.suiteStepFail();
  //   runner.end();
  // });

  it('should output the correct counts when the runner ends', (done) => {
    sinon.stub(tap.writer, 'lines');
    runner.on(events.END, () => {
      sinon.assert.calledOnce(tap.writer.lines);
      const out = [
        '# tests 6',
        '# pass 3',
        '# fail 3',
        '# assertions 18',
      ]
      sinon.assert.calledWith(tap.writer.lines, ...out);
      done();
    });
    runner.suiteStepCount(6);
    runner.suiteAssertionCount(6 * 3);
    runner.start();
    const step = { name: 'step' };
    for(let i = 0; i < 3; i++) {
      runner.suiteStepPass(step);
      runner.suiteStepFail(step, { stack: ''});
    }
    runner.end();
  });
});