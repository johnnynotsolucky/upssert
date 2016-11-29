import { EventEmitter } from 'events';
import { HttpRequest, makeRequest, httpStat } from './http';
import AssertObject from './object/assert';
import Suite from './suite';
import events from '../data/events.json';
import globals from './globals';
import validateSuite from './validate-suite';

class Runner extends EventEmitter {
  constructor(options) {
    super();
    this.config = options.config;
    this.suiteCount = 0;
    this.testCount = 0;
    this.assertionCount = 0;
    this.stopExecution = false;
  }

  async run(suites) {
    for (const [index, value] of suites.entries()) {
      const validation = validateSuite(value);
      if (validation === true) {
        const suite = new Suite(value);
        this.testCount += suite.tests.length;
        this.assertionCount += suite.assertionCount;
        suites[index] = suite;
      } else {
        this.stopExecution = true;
        this.emit(events.FAIL, value, validation);
        this.emit(events.SUITE_FAIL, value, validation);
      }
    }
    this.suiteCount = suites.length;
    this.emit(events.SUITE_COUNT, this.suiteCount);
    this.emit(events.TEST_COUNT, this.testCount);
    this.emit(events.ASSERTION_COUNT, this.assertionCount);
    this.emit(events.START);
    for (const suite of suites) {
      if (!this.stopExecution) {
        this.emit(events.SUITE_START, suite);
        await this.executeTestsInOrder(suite);
        this.emit(events.SUITE_END, suite);
      } else {
        break;
      }
    }
    this.emit(events.END);
  }

  async executeTestsInOrder(suite) {
    const results = {};
    for (const test of suite.tests) {
      const result = await this.executeTest(test, results);
      results[result.test.id] = result;
    }
  }

  async executeTest(test, resultset) {
    this.emit(events.SUITE_TEST_START, test);
    const requiredData = Runner.extractRequiredData(test, resultset);
    const data = { ...requiredData, ...globals };
    const httpRequest = new HttpRequest(test.request, data, this.config);
    let testPassed = false;
    let stat;
    const result = {
      trace: httpRequest.trace,
      test,
    };
    try {
      const response = await makeRequest(httpRequest);
      stat = httpStat(response);
      testPassed = false;
      if (stat) {
        const assertObject =
          new AssertObject(stat, test.assertions, data, this.config);
        testPassed = assertObject.assert((err) => {
          this.emit(events.SUITE_TEST_FAIL, test, err);
        });
        if (testPassed) {
          this.emit(events.SUITE_TEST_PASS, test);
        }
      }
      this.emit(events.SUITE_TEST_END, test);
      result.result = stat;
    } catch (err) {
      this.emit(events.SUITE_TEST_FAIL, test, err);
    }
    result.pass = testPassed;
    return result;
  }

  static extractRequiredData(test, results) {
    const data = {};
    if (test.requires && results) {
      test.requires.forEach((id) => {
        data[id] = results[id].result;
      });
    }
    return data;
  }
}

export default Runner;
