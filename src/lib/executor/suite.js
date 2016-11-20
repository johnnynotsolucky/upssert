import { EventEmitter } from 'events';
import tv4 from 'tv4';
import formdataSchema from '../../data/schema/formdata.json';
import requestSchema from '../../data/schema/request.json';
import testSchema from '../../data/schema/test.json';
import suiteSchema from '../../data/schema/suite.json';
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
    await this.executeStepsInOrder();
    this.emit(events.SUITE_END, this.testCase);
  }

  initialize() {
    tv4.addSchema('formdata-schema', formdataSchema);
    tv4.addSchema('request-schema', requestSchema);
    tv4.addSchema('test-schema', testSchema);
    const testValid = tv4.validate(this.testCase, suiteSchema);
    if (testValid) {
      this.emit(events.SUITE_COUNT, 1);
      this.initializeSteps();
    } else {
      this.emit(events.SUITE_FAIL, this.testCase, tv4.error);
    }
  }

  initializeSteps() {
    let i = 1;
    for (const step of this.testCase.steps) {
      if (!step.id) {
        step.id = `step${i}`;
        i += 1;
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

  async executeStepsInOrder() {
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
