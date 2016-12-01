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
    const suites = this.suitesFromDefinitions(definitions);
    const results = this.startExecutionIfValid(suites);
    return results;
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
    const results = { pass: true };
    if (suites !== false) {
      this.suiteCount = suites.length;
      this.emit(events.SUITE_COUNT, this.suiteCount);
      this.emit(events.TEST_COUNT, this.testCount);
      this.emit(events.ASSERTION_COUNT, this.assertionCount);
      this.emit(events.START);
      for (const [index, value] of suites.entries()) {
        const testResult = await this.executeSuite(value);
        results[index] = testResult;
      }
      this.emit(events.END);
    } else {
      results.pass = false;
    }
    return results;
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
    const dependencies = Runner.extractDependencies(test, resultset);
    const result = { test };
    let testPassed = false;
    if (Runner.dependenciesHaveFailed(dependencies)) {
      const err = new Error('Failed dependencies');
      this.emit(events.SUITE_TEST_FAIL, test, err);
    } else {
      const data = { ...dependencies, ...globals };
      const httpRequest = new HttpRequest(test.request, data, this.config);
      result.trace = httpRequest.trace;
      let stat;
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
        result.stat = stat;
      } catch (err) {
        this.emit(events.SUITE_TEST_FAIL, test, err);
      }
    }
    result.pass = testPassed;
    return result;
  }

  static dependenciesHaveFailed(dependencies) {
    return Object.keys(dependencies)
      .map(key => dependencies[key])
      .some(dependency => dependency.pass !== true);
  }

  static extractDependencies(test, results) {
    const data = {};
    if (test.requires && results) {
      for (const id of test.requires) {
        data[id] = {
          ...results[id].stat,
          pass: results[id].pass,
        };
      }
    }
    return data;
  }
}

export default Runner;
