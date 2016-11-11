import { EventEmitter } from 'events';
import { SuiteExecutor } from './suiteExecutor';

const events = {
  START: 'start',
  END: 'end',
  SUITE: {
    START: 'suite.start',
    FAIL: 'suite.fail',
    END: 'suite.end',
    STEP: {
      START: 'suite.step.start',
      FAIL: 'suite.step.fail',
      PASS: 'suite.step.pass',
      END: 'suite.step.end',
      COUNT: 'suite.step.count',
    },
  },
};

class Runner extends EventEmitter {
  constructor(suites) {
    super();
    this.bindEmitters();
    this.suites = suites;
    this.executors = [];
    suites.forEach((suite) => {
      const executor = new SuiteExecutor(suite);
      this.executors.push(executor);
    });
  }

  bindEmitters() {
    this.suiteStart = this.suiteStart.bind(this);
    this.suiteEnd = this.suiteEnd.bind(this);
    this.suiteFail = this.suiteFail.bind(this);
    this.suiteStepStart = this.suiteStepStart.bind(this);
    this.suiteStepEnd = this.suiteStepEnd.bind(this);
    this.suiteStepPass = this.suiteStepPass.bind(this);
    this.suiteStepFail = this.suiteStepFail.bind(this);
    this.suiteStepCount = this.suiteStepCount.bind(this);
  }

  async run() {
    const { events: suiteEvents } = require('./suiteExecutor');
    this.emit(events.START);
    for (const executor of this.executors) {
      executor.on(suiteEvents.START, this.suiteStart);
      executor.on(suiteEvents.END, this.suiteEnd);
      executor.on(suiteEvents.FAIL, this.suiteFail);
      executor.on(suiteEvents.STEP.START, this.suiteStepStart);
      executor.on(suiteEvents.STEP.END, this.suiteStepEnd);
      executor.on(suiteEvents.STEP.PASS, this.suiteStepPass);
      executor.on(suiteEvents.STEP.FAIL, this.suiteStepFail);
      executor.on(suiteEvents.STEP.COUNT, this.suiteStepCount);
      await executor.execute();
    }
    this.emit(events.END);
  }

  emitt(val) {
    console.log(val);
  }

  suiteStart(suite) {
    this.emit(events.SUITE.START, suite);
  }

  suiteEnd(suite) {
    this.emit(events.SUITE.END, suite);
  }

  suiteFail(suite, err) {
    this.emit(events.FAIL, suite, err);
  }

  suiteStepStart(step) {
    this.emit(events.SUITE.STEP.START, step);
  }

  suiteStepEnd(step) {
    this.emit(events.SUITE.STEP.END, step);
  }

  suiteStepPass(step) {
    this.emit(events.SUITE.STEP.PASS, step);
  }

  suiteStepFail(step, err) {
    this.emit(events.SUITE.STEP.FAIL, step, err);
  }

  suiteStepCount(count) {
    this.emit(events.SUITE.STEP.COUNT, count);
  }
}

export default Runner;
