import events from '../../data/events.json';


class TAP {
  constructor(runner) {
    this.stepCount = 0;
    this.assertionCount = 0;
    this.passes = 0;
    this.fails = 0;
    this.tests = 1;
    this.bindHandlers(runner);
  }

  bindHandlers(runner) {
    runner.on(events.SUITE_STEP_COUNT, this::this.handleCount);
    runner.on(events.SUITE_ASSERTION_COUNT, this::this.handleAssertCount);
    runner.on(events.START, this::this.handleStart);
    runner.on(events.SUITE_STEP_PASS, this::this.handleStepPass);
    runner.on(events.SUITE_STEP_FAIL, this::this.handleStepFail);
    runner.on(events.END, this::this.handleEnd);
  }

  handleCount(count) {
    this.stepCount += count;
  }

  handleAssertCount(count) {
    this.assertionCount += count;
  }

  handleStart() {
    console.log('%d..%d', 1, this.stepCount);
  }

  handleStepPass(step) {
    this.passes++;
    console.log('ok %d %s', this.tests, this.name(step));

  }

  handleStepFail(step, err) {
    this.fails++;
    console.log('not ok %d %s', this.tests, this.name(step));
    if (err.stack) {
      console.log(err.stack.replace(/^/gm, '  '));
    }
  }

  handleEnd() {
    console.log(`# tests ${this.stepCount}`);
    console.log('# pass ' + this.passes);
    console.log('# fail ' + this.fails);
    console.log(`# assertions ${this.assertionCount}`);
  }

  name(step) {
    return step.name.replace(/#/g, '_');
  }
}

export default TAP;