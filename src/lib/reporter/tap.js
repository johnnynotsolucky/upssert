import events from '../../data/events.json';

const name = step => step.name.replace(/#/g, '_');

class TAP {
  constructor(runner, writer) {
    this.writer = writer;
    this.stepCount = 0;
    this.assertionCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 1;
    this.bail = false;
    this.bindHandlers(runner);
  }

  bindHandlers(runner) {
    runner.on(events.SUITE_STEP_COUNT, this::this.handleCount);
    runner.on(events.SUITE_ASSERTION_COUNT, this::this.handleAssertCount);
    runner.on(events.START, this::this.handleStart);
    runner.on(events.SUITE_STEP_PASS, this::this.handleStepPass);
    runner.on(events.SUITE_STEP_FAIL, this::this.handleStepFail);
    runner.on(events.SUITE_FAIL, this::this.handleSuiteFail);
    runner.on(events.END, this::this.handleEnd);
  }

  handleCount(count) {
    this.stepCount += count;
  }

  handleAssertCount(count) {
    this.assertionCount += count;
  }

  handleStart() {
    this.runIfNotBailed(() => {
      this.writer.out('%d..%d', 1, this.stepCount);
    });
  }

  handleStepPass(step) {
    this.passes += 1;
    this.runIfNotBailed(() => {
      this.writer.out('ok %d %s', this.tests, name(step));
    });
  }

  handleStepFail(step, err) {
    this.fails += 1;
    this.runIfNotBailed(() => {
      this.writer.out('not ok %d %s', this.tests, name(step));
      if (err.stack) {
        this.writer.out(err.stack.replace(/^/gm, '  '));
      }
    });
  }

  handleSuiteFail(suite, err) {
    this.bail = true;
    this.writer.out('Bail out! %s', err.message);
  }

  handleEnd() {
    this.runIfNotBailed(() => {
      const out = [
        `# tests ${this.stepCount}`,
        `# pass ${this.passes}`,
        `# fail ${this.fails}`,
        `# assertions ${this.assertionCount}`,
      ];
      this.writer.lines(...out);
    });
  }

  runIfNotBailed(fn) {
    if (!this.bail) {
      fn();
    }
  }
}

export default (runner, writer) => {
  const tap = new TAP(runner, writer);
  return tap;
};
