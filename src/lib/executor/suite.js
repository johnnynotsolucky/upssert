import { EventEmitter } from 'events';
import tv4 from 'tv4';
import schema from '../../data/test-case-schema.json';
import StepExecutor from './step';
import events from '../../data/events.json';

class Suite extends EventEmitter {
  constructor(testCase) {
    super();
    this.bindEmitters();
    this.testCase = testCase;
    this.stepExecutors = [];
  }

  bindEmitters() {
    this.stepStart = this.stepStart.bind(this);
    this.stepEnd = this.stepEnd.bind(this);
    this.stepPass = this.stepPass.bind(this);
    this.stepFail = this.stepFail.bind(this);
    this.assertionCount = this.assertionCount.bind(this);
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
    let i = 1;
    for (const step of this.testCase.steps) {
      if (!step.id) {
        step.id = `step-${i++}`;
      }
      const executor = new StepExecutor(step);
      executor.on(events.SUITE_STEP_START, this.stepStart);
      executor.on(events.SUITE_STEP_END, this.stepEnd);
      executor.on(events.SUITE_STEP_PASS, this.stepPass);
      executor.on(events.SUITE_STEP_FAIL, this.stepFail);
      executor.on(events.SUITE_ASSERTION_COUNT, this.assertionCount);
      executor.initialize();
      this.stepExecutors.push(executor);

    }
    this.emit(events.SUITE_STEP_COUNT, this.testCase.steps.length);
  }

  async executeStepsInOrder(steps) {
    const results = {};
    for (const executor of this.stepExecutors) {
      const result = await executor.execute(results);
      results[result.step.id] = result;
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

  assertionCount(count) {
    this.emit(events.SUITE_ASSERTION_COUNT, count);
  }
}

export default Suite;
