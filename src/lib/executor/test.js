import { EventEmitter } from 'events';
import falsy from 'falsy';
import AssertObject from '../object/assert';
import generateToken from '../util/generate-token';
import { HttpRequest, makeRequest, httpStat } from '../http';
import events from '../../data/events.json';
import globals from '../globals';

class Test extends EventEmitter {
  constructor(test) {
    super();
    this.test = test;
    this.assertions = [];
  }

  async execute(resultset) {
    this.emit(events.SUITE_TEST_START, this.test);
    const trace = this.addTraceHeader();
    const data = Object.assign(this.extractRequiredData(resultset), globals);
    const httpRequest = new HttpRequest(this.test.request, data);
    const response = await makeRequest(httpRequest);
    const stat = httpStat(response);
    let testPassed = false;
    if (stat) {
      const assertObject = new AssertObject(stat, this.assertions, data);
      testPassed = assertObject.assert((err) => {
        this.emit(events.SUITE_TEST_FAIL, this.test, err);
      });
      if (testPassed) {
        this.emit(events.SUITE_TEST_PASS, this.test);
      }
    }
    this.emit(events.SUITE_TEST_END, this.test);
    return {
      trace,
      test: this.test,
      pass: testPassed,
      result: stat,
    };
  }

  addTraceHeader() {
    if (!this.test.request.headers) {
      this.test.request.headers = {};
    }
    const token = generateToken();
    this.test.request.headers['X-Upssert-Trace'] = token;
    return token;
  }

  extractRequiredData(results) {
    const data = {};
    if (this.test.requires) {
      this.test.requires.forEach((id) => {
        data[id] = results[id].result;
      });
    }
    return data;
  }

  initialize() {
    const responseSet = !falsy(this.test.response);
    this.addAssertionsIfReponseIsSet(responseSet);
    this.addDefaultPingAssertions(responseSet);
  }

  addAssertionsIfReponseIsSet(responseSet) {
    if (responseSet) {
      Object.keys(this.test.response).forEach((key) => {
        const assertion = this.test.response[key];
        this.addEqualAssertionIfString(assertion, key);
        this.addAssertionsIfObject(assertion, key);
      });
    }
  }

  addEqualAssertionIfString(assertion, key) {
    if (typeof assertion === 'string') {
      this.assertions.push({
        [key]: {
          equal: assertion,
        },
      });
      this.emit(events.SUITE_ASSERTION_COUNT, 1);
    }
  }

  addAssertionsIfObject(assertion, key) {
    if (typeof assertion === 'object') {
      this.assertions.push({
        [key]: assertion,
      });
      this.emit(events.SUITE_ASSERTION_COUNT, Object.keys(assertion).length);
    }
  }

  addDefaultPingAssertions(responseSet) {
    if (!responseSet) {
      this.assertions.push({
        statusCode: {
          isAtLeast: 200,
          isBelow: 400,
        },
      });
      this.emit(events.SUITE_ASSERTION_COUNT, 2);
    }
  }
}

export default Test;
