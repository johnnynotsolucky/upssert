import events from '../../data/events.json';


class TAP {
  constructor(runner) {
    this.stepCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 1;
    this.bindHandlers(runner);
  }

  bindHandlers(runner) {
    runner.on(events.SUITE_STEP_COUNT, this::this.handleCount);
    runner.on(events.START, this::this.handleStart);
    runner.on(events.SUITE_STEP_PASS, this::this.handleStepPass);
    runner.on(events.SUITE_STEP_FAIL, this::this.handleStepFail);
    runner.on(events.SUITE_STEP_END, this::this.handleStepEnd);
    runner.on(events.END, this::this.handleEnd);
  }

  handleCount(count) {
    this.stepCount += count;
  }

  handleStart() {
    console.log('%d..%d', 1, this.stepCount);
  }

  handleStepPass(step) {
    this.passes++;
    console.log('ok %d %s', this.tests, step.name);

  }

  handleStepFail(step, err) {
    this.fails++;
    console.log('not ok %d %s', this.tests, step.name);
    if (err.stack) {
      console.log(err.stack.replace(/^/gm, '  '));
    }
  }

  handleStepEnd() {
    this.tests++;
  }

  handleEnd() {
    console.log('# tests ' + this.tests);
    console.log('# pass ' + this.passes);
    console.log('# fail ' + this.fails);
  }
}

export default TAP;