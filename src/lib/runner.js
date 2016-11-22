import { EventEmitter } from 'events';
import SuiteExecutor from './executor/suite';
import events from '../data/events.json';

class Runner extends EventEmitter {
  constructor() {
    super();
    this.bindEmitters();
    this.executors = [];
    this.stopExecution = false;
  }

  setSuites(suites) {
    this.suites = suites;
  }

  bindEmitters() {
    this.suiteCount = this.suiteCount.bind(this);
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
      if (!this.stopExecution) {
        await executor.execute();
      } else {
        break;
      }
    }
    this.emit(events.END);
  }

  initialize() {
    this.suites.forEach((suite) => {
      const executor = new SuiteExecutor(suite);
      executor.on(events.SUITE_COUNT, this.suiteCount);
      executor.on(events.SUITE_START, this.suiteStart);
      executor.on(events.SUITE_END, this.suiteEnd);
      executor.on(events.SUITE_FAIL, this.suiteFail);
      executor.on(events.SUITE_TEST_START, this.suiteStepStart);
      executor.on(events.SUITE_TEST_END, this.suiteStepEnd);
      executor.on(events.SUITE_TEST_PASS, this.suiteStepPass);
      executor.on(events.SUITE_TEST_FAIL, this.suiteStepFail);
      executor.on(events.SUITE_ASSERTION_COUNT, this.suiteAssertionCount);
      executor.on(events.SUITE_TEST_COUNT, this.suiteStepCount);
      executor.initialize();
      this.executors.push(executor);
    });
  }

  suiteCount(count) {
    this.emit(events.SUITE_COUNT, count);
  }

  suiteStart(suite) {
    this.emit(events.SUITE_START, suite);
  }

  suiteEnd(suite) {
    this.emit(events.SUITE_END, suite);
  }

  suiteFail(suite, err) {
    this.stopExecution = true;
    this.emit(events.FAIL, suite, err);
    this.emit(events.SUITE_FAIL, suite, err);
  }

  suiteStepStart(test) {
    this.emit(events.SUITE_TEST_START, test);
  }

  suiteStepEnd(test) {
    this.emit(events.SUITE_TEST_END, test);
  }

  suiteStepPass(test) {
    this.emit(events.SUITE_TEST_PASS, test);
  }

  suiteStepFail(test, err) {
    this.emit(events.FAIL, test, err);
    this.emit(events.SUITE_TEST_FAIL, test, err);
  }

  suiteAssertionCount(count) {
    this.emit(events.SUITE_ASSERTION_COUNT, count);
  }

  suiteStepCount(count) {
    this.emit(events.SUITE_TEST_COUNT, count);
  }
}

export default Runner;
