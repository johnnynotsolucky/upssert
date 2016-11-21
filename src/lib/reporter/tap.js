import events from '../../data/events.json';

const name = step => step.name.replace(/#/g, '_');

class TAP {
  constructor() {
    this.stepCount = 0;
    this.assertionCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 0;
    this.bail = false;
  }

  setWriter(writer) {
    this.writer = writer;
  }

  setEventEmitter(emitter) {
    this.bindHandlers(emitter);
  }

  bindHandlers(emitter) {
    emitter.on(events.SUITE_STEP_COUNT, this::this.handleCount);
    emitter.on(events.SUITE_ASSERTION_COUNT, this::this.handleAssertCount);
    emitter.on(events.START, this::this.handleStart);
    emitter.on(events.SUITE_STEP_START, this::this.handleStepStart);
    emitter.on(events.SUITE_STEP_PASS, this::this.handleStepPass);
    emitter.on(events.SUITE_STEP_FAIL, this::this.handleStepFail);
    emitter.on(events.SUITE_FAIL, this::this.handleSuiteFail);
    emitter.on(events.END, this::this.handleEnd);
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

  handleStepStart() {
    this.tests += 1;
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
      const out = [
        `not ok ${this.tests} ${name(step)}`,
        `  Error: ${err.message}`,
      ];
      this.writer.lines(...out);
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

export default TAP;
