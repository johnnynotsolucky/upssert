import { EventEmitter } from 'events';
import SuiteExecutor from './suiteExecutor';
import events from '../data/events.json';

class Runner extends EventEmitter {
  constructor(suites) {
    super();
    this.bindEmitters();
    this.suites = suites;
    this.executors = [];
  }

  bindEmitters() {
    this.suiteStart = this.suiteStart.bind(this);
    this.suiteEnd = this.suiteEnd.bind(this);
    this.suiteFail = this.suiteFail.bind(this);
    this.suiteStepStart = this.suiteStepStart.bind(this);
    this.suiteStepEnd = this.suiteStepEnd.bind(this);
    this.suiteStepPass = this.suiteStepPass.bind(this);
    this.suiteStepFail = this.suiteStepFail.bind(this);
    this.suiteAssertionCount = this.suiteAssertionCount.bind(this);
    this.suiteStepCount = this.suiteStepCount.bind(this);
  }

  async run() {
    this.initialize();
    this.emit(events.START);
    for (const executor of this.executors) {
      await executor.execute();
    }
    this.emit(events.END);
  }

  initialize() {
    this.suites.forEach((suite) => {
      const executor = new SuiteExecutor(suite);
      executor.on(events.SUITE_START, this.suiteStart);
      executor.on(events.SUITE_END, this.suiteEnd);
      executor.on(events.SUITE_FAIL, this.suiteFail);
      executor.on(events.SUITE_STEP_START, this.suiteStepStart);
      executor.on(events.SUITE_STEP_END, this.suiteStepEnd);
      executor.on(events.SUITE_STEP_PASS, this.suiteStepPass);
      executor.on(events.SUITE_STEP_FAIL, this.suiteStepFail);
      executor.on(events.SUITE_ASSERTION_COUNT, this.suiteAssertionCount);
      executor.on(events.SUITE_STEP_COUNT, this.suiteStepCount);
      executor.initialize();
      this.executors.push(executor);
    });
  }

  suiteStart(suite) {
    this.emit(events.SUITE_START, suite);
  }

  suiteEnd(suite) {
    this.emit(events.SUITE_END, suite);
  }

  suiteFail(suite, err) {
    this.emit(events.SUITE_FAIL, suite, err);
  }

  suiteStepStart(step) {
    this.emit(events.SUITE_STEP_START, step);
  }

  suiteStepEnd(step) {
    this.emit(events.SUITE_STEP_END, step);
  }

  suiteStepPass(step) {
    this.emit(events.SUITE_STEP_PASS, step);
  }

  suiteStepFail(step, err) {
    this.emit(events.SUITE_STEP_FAIL, step, err);
  }

  suiteAssertionCount(count) {
    this.emit(events.SUITE_ASSERTION_COUNT, count);
  }

  suiteStepCount(count) {
    this.emit(events.SUITE_STEP_COUNT, count);
  }
}

export default Runner;
