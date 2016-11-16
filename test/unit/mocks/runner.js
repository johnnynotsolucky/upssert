import { EventEmitter } from 'events';
import events from '../../../src/data/events.json';

class Runner extends EventEmitter {
  start() {
    this.emit(events.START);
  }

  fail() {
    this.emit(events.FAIL);
  }

  end() {
    this.emit(events.END);
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
