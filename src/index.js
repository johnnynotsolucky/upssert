import 'babel-polyfill';
import { EventEmitter } from 'events';
import Runner from './lib/runner';
import TAP from './lib/reporter/tap';
import events from './data/events.json';

class Upssert extends EventEmitter {

  execute(tests) {
    if (!Array.isArray(tests)) {
      tests = [tests];
    }
    const runner = new Runner(tests);
    runner.on(events.FAIL, (obj, err) => {
      this.emit(events.FAIL, obj, err);
    });
    new TAP(runner);
    runner.run();
  }
}

export default Upssert;
