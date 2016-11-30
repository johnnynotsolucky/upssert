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

  async run(definitions) {
    let suites = this.suitesFromDefinitions(definitions);
    suites = this.startExecutionIfValid(suites);
    return suites;
  }

  suitesFromDefinitions(definitions) {
    const suites = [];
    let result = suites;
    while (definitions.length > 0 && !this.stopExecution) {
      const definition = definitions.shift();
      const validation = validateSuite(definition);
      if (validation === true) {
        const suite = new Suite(definition);
        this.testCount += suite.tests.length;
        this.assertionCount += suite.assertionCount;
        suites.push(suite);
      } else {
        this.stopExecution = true;
        this.emit(events.FAIL, definition, validation);
        this.emit(events.SUITE_FAIL, definition, validation);
        result = false;
      }
    }
    return result;
  }

  async startExecutionIfValid(suites) {
    if (suites !== false) {
      this.suiteCount = suites.length;
      this.emit(events.SUITE_COUNT, this.suiteCount);
      this.emit(events.TEST_COUNT, this.testCount);
      this.emit(events.ASSERTION_COUNT, this.assertionCount);
      this.emit(events.START);
      for (const suite of suites) {
        suite.results = await this.executeSuite(suite);
      }
      this.emit(events.END);
    }
    return suites;
  }

  async executeSuite(suite) {
    this.emit(events.SUITE_START, suite);
    const results = {};
    for (const test of suite.tests) {
      const result = await this.executeTest(test, results);
      results[result.test.id] = result;
    }
    this.emit(events.SUITE_END, suite);
    return results;
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
