import { EventEmitter } from 'events';
import tv4 from 'tv4';
import schema from './schema/test-case.json';
import StepExecutor from './stepExecutor';
import events from '../data/events.json';

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
    this.emit(events.SUITE_START, this.testCase);
    await this.executeStepsInOrder(this.testCase.steps);
    this.emit(events.SUITE_END, this.testCase);
  }

  initialize() {
    const testValid = tv4.validate(this.testCase, schema);
    if (testValid) {
      this.initializeSteps();
    } else {
      this.emit(events.SUITE_FAIL, this.testCase, tv4.error);
    }
  }

  initializeSteps() {
    for (const step of this.testCase.steps) {
      const executor = new StepExecutor(step);
      executor.on(events.SUITE_STEP_START, this.stepStart);
      executor.on(events.SUITE_STEP_END, this.stepEnd);
      executor.on(events.SUITE_STEP_PASS, this.stepPass);
      executor.on(events.SUITE_STEP_FAIL, this.stepFail);
      executor.on(events.SUITE_STEP_COUNT, this.stepCount);
      executor.initialize();
      this.stepExecutors.push(executor);
    }
  }

  async executeStepsInOrder(steps) {
    for (const executor of this.stepExecutors) {
      await executor.execute();
    }
  }

  stepStart(step) {
    this.emit(events.SUITE_STEP_START, step);
  }

  stepEnd(step) {
    this.emit(events.SUITE_STEP_END, step);
  }

  stepPass(step) {
    this.emit(events.SUITE_STEP_PASS, step);
  }

  stepFail(step, err) {
    this.emit(events.SUITE_STEP_FAIL, step, err);
  }

  stepCount(count) {
    this.assertionCount += count;
    this.emit(events.SUITE_STEP_COUNT, count);
  }
}

export default SuiteExecutor;
