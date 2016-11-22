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

  suiteTestStart(test) {
    this.emit(events.SUITE_TEST_START, test);
  }

  suiteTestEnd(test) {
    this.emit(events.SUITE_TEST_END, test);
  }

  suiteTestPass(test) {
    this.emit(events.SUITE_TEST_PASS, test);
  }

  suiteTestFail(test, err) {
    this.emit(events.SUITE_TEST_FAIL, test, err);
  }

  suiteAssertionCount(count) {
    this.emit(events.SUITE_ASSERTION_COUNT, count);
  }

  suiteTestCount(count) {
    this.emit(events.SUITE_TEST_COUNT, count);
  }
}

export default Runner;
