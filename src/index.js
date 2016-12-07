import 'babel-polyfill';
import { EventEmitter } from 'events';
import TapReporter from './lib/reporter/tap';
import ConsoleReporter from './lib/reporter/console';
import Runner from './lib/runner';
import LogWriter from './lib/writer/log';
import events from './data/events.json';

class Upssert extends EventEmitter {
  constructor(options) {
    super();
    const { config } = options;
    let { suites, reporter } = options;
    if (typeof suites === 'string') {
      suites = this.createSuiteForUrl(suites);
    }
    this.suites = !Array.isArray(suites) ? [suites] : suites;
    this.runner = new Runner(config);
    if (!reporter) {
      reporter = new ConsoleReporter();
    }
    this.reporter = reporter;
    this.reporter.setEventEmitter(this.runner);
    this.runner.on(events.FAIL, (obj, err) => {
      this.emit(events.FAIL, obj, err);
    });
  }

  createSuiteForUrl(url) {
    return {
      name: 'Ping',
      tests: [{
        name: url,
        request: {
          url,
        },
      }],
    };
  }

  async execute() {
    const results = await this.runner.run(this.suites);
    return results;
  }
}

export default Upssert;
export {
  TapReporter,
  ConsoleReporter,
  LogWriter,
};
