import { EventEmitter } from 'events';
import tv4 from 'tv4';
import schema from './schema/test-case.json';
import { StepExecutor } from './stepExecutor';

const events = {
  START: 'start',
  FAIL: 'fail',
  END: 'end',
  STEP: {
    START: 'step.start',
    FAIL: 'step.fail',
    PASS: 'step.pass',
    END: 'step.end',
    COUNT: 'step.count',
  },
};

class SuiteExecutor extends EventEmitter {
  constructor(testCase) {
    super();
    this.bindEmitters();
    this.testCase = testCase;
    this.stepExecutors = [];
    this.assertionCount = 0;
  }

  bindEmitters() {
    this.stepStart = this.stepStart.bind(this);
    this.stepEnd = this.stepEnd.bind(this);
    this.stepPass = this.stepPass.bind(this);
    this.stepFail = this.stepFail.bind(this);
    this.stepCount = this.stepCount.bind(this);
  }

  async execute() {
    this.emit('start', this.testCase);
    this.initialize();
    await this.executeStepsInOrder(this.testCase.steps);
    this.emit('end', this.testCase);
  }

  initialize() {
    const testValid = tv4.validate(this.testCase, schema);
    if (testValid) {
      this.initializeSteps();
    } else {
      this.emit('fail', this.testCase, tv4.error);
    }
  }

  initializeSteps() {
    for (const step of this.testCase.steps) {
      const executor = new StepExecutor(step);
      this.stepExecutors.push(executor);
    }
  }

  async executeStepsInOrder(steps) {
    const { events: stepEvents } = require('./suiteExecutor');
    for (const executor of this.stepExecutors) {
      executor.on(stepEvents.START, this.stepStart);
      executor.on(stepEvents.END, this.stepEnd);
      executor.on(stepEvents.PASS, this.stepPass);
      executor.on(stepEvents.FAIL, this.stepFail);
      executor.on(stepEvents.COUNT, this.stepCount);
      await executor.execute();
    }
  }

  stepStart(step) {
    this.emit(events.STEP.START, step);
  }

  stepEnd(step) {
    this.emit(events.STEP.END, step);
  }

  stepPass(step) {
    this.emit(events.STEP.PASS, step);
  }

  stepFail(step, err) {
    this.emit(events.STEP.FAIL, step, err);
  }

  stepCount(count) {
    this.assertionCount += count;
    this.emit(events.STEP.COUNT, count);
  }
}

export { SuiteExecutor, events };
