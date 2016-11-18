import 'babel-polyfill';
import { EventEmitter } from 'events';
import events from './data/events.json';

class Upssert extends EventEmitter {
  constructor(suites, runner, reporter, writer) {
    super();
    this.suites = !Array.isArray(suites) ? [suites] : suites;
    this.runner = runner;
    this.writer = writer;
    this.reporter = reporter;
    this.runner.setSuites(this.suites);
    this.reporter.setRunner(this.runner);
    this.reporter.setWriter(this.writer);
    this.runner.on(events.FAIL, (obj, err) => {
      this.emit(events.FAIL, obj, err);
    });
  }

  execute() {
    this.runner.run();
  }
}

export default Upssert;
