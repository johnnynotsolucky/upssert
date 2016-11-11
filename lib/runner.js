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
    },
  },
};

class Runner extends EventEmitter {
  constructor(suites) {
    super();
    this.suites = suites;
    this.executors = [];
    suites.forEach((suite) => {
      const executor = new SuiteExecutor(suite);
      this.executors.push(executor);
    });
  }

  async run() {
    const { events: suiteEvents } = require('./suiteExecutor');
    this.emit(events.START);
    for (const executor of this.executors) {
      executor.on(suiteEvents.START, this.suiteStart.bind(this));
      executor.on(suiteEvents.END, this.suiteEnd.bind(this));
      executor.on(suiteEvents.FAIL, this.suiteFail.bind(this));
      executor.on(suiteEvents.STEP.START, this.suiteStepStart.bind(this));
      executor.on(suiteEvents.STEP.END, this.suiteStepEnd.bind(this));
      executor.on(suiteEvents.STEP.PASS, this.suiteStepPass.bind(this));
      executor.on(suiteEvents.STEP.FAIL, this.suiteStepFail.bind(this));
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
}

export default Runner;
