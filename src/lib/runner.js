import { EventEmitter } from 'events';
import { HttpRequest, makeRequest, formatResponse } from './http';
import AssertObject from './object/assert';
import Suite from './suite';
import events from '../data/events.json';
import getGlobals from './globals';
import validateSuite from './validate-suite';

class Runner extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.suiteCount = 0;
    this.testCount = 0;
    this.assertionCount = 0;
    this.stopExecution = false;
  }

  async run(definitions) {
    const suites = this.suitesFromDefinitions(definitions);
    const results = await this.startExecutionIfValid(suites);
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
        const dataPath = validation.dataPath || '/';
        result = {
          fail: `[${dataPath}] ${validation.message}`,
        };
      }
    }
    return result;
  }

  async startExecutionIfValid(suites) {
    const results = { pass: true };
    let failMessage;
    let passed = true;
    if (suites.fail) {
      passed = false;
      failMessage = suites.fail;
    } else {
      this.suiteCount = suites.length;
      this.emit(events.SUITE_COUNT, this.suiteCount);
      this.emit(events.TEST_COUNT, this.testCount);
      this.emit(events.ASSERTION_COUNT, this.assertionCount);
      this.emit(events.START);
      for (const [index, value] of suites.entries()) {
        const testResult = await this.executeSuite(value);
        results[index] = this.appendMetaData(testResult, value);
        if (testResult.pass === false) {
          passed = false;
        }
      }
      this.emit(events.END);
    }
    results.pass = passed;
    if (!passed && failMessage) {
      results.reason = failMessage;
    }
    return results;
  }

  appendMetaData(result, suite) {
    if (suite.meta !== undefined && suite.meta !== null) {
      result.meta = suite.meta;
    } else {
      result.meta = {};
    }
    return result;
  }

  async executeSuite(suite) {
    this.emit(events.SUITE_START, suite);
    let suitePassed = true;
    const results = { tests: {} };
    for (const test of suite.tests) {
      const result = await this.executeTest(test, results.tests);
      results.tests[test.id] = result;
      if (result.pass === false) {
        suitePassed = false;
      }
    }
    results.pass = suitePassed;
    this.emit(events.SUITE_END, suite);
    return results;
  }

  async executeTest(test, resultset) {
    this.emit(events.SUITE_TEST_START, test);
    const dependencies = this.extractDependencies(test, resultset);
    const result = {};
    let failMessage;
    let testPassed = false;
    if (this.dependenciesHaveFailed(dependencies)) {
      const err = new Error('Failed dependencies');
      failMessage = err.message;
      this.emit(events.SUITE_TEST_FAIL, test, err);
    } else {
      const globals = getGlobals(this.config);
      const data = { ...dependencies, ...globals };
      const httpRequest = new HttpRequest(test.request, data, this.config);
      result.trace = httpRequest.trace;
      let formattedResponse;
      try {
        const response = await makeRequest(httpRequest);
        formattedResponse = formatResponse(response);
        testPassed = false;
        if (formattedResponse) {
          const assertObject =
            new AssertObject(formattedResponse, test.assertions, data, this.config);
          testPassed = assertObject.assert((err) => {
            failMessage = err.message;
            this.emit(events.SUITE_TEST_FAIL, test, err);
          });
          if (testPassed) {
            this.emit(events.SUITE_TEST_PASS, test);
          }
        }
        this.emit(events.SUITE_TEST_END, test);
        result.response = formattedResponse;
      } catch (err) {
        failMessage = err.message;
        this.emit(events.SUITE_TEST_FAIL, test, err);
      }
    }
    result.pass = testPassed;
    if (!testPassed) {
      result.reason = failMessage;
    }
    return result;
  }

  dependenciesHaveFailed(dependencies) {
    return Object.keys(dependencies)
      .map(key => dependencies[key])
      .some(dependency => dependency.pass !== true);
  }

  extractDependencies(test, results) {
    const data = {};
    if (test.requires && results) {
      for (const id of test.requires) {
        data[id] = {
          ...results[id].response,
          pass: results[id].pass,
        };
      }
    }
    return data;
  }
}

export default Runner;
