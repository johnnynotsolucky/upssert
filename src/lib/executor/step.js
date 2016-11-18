import { EventEmitter } from 'events';
import falsy from 'falsy';
import AssertObject from '../object/assert';
import generateToken from '../util/generate-token';
import HttpRequest from '../httpRequest';
import events from '../../data/events.json';

class Step extends EventEmitter {
  constructor(step) {
    super();
    this.step = step;
    this.assertions = [];
  }

  async execute(resultset) {
    this.emit(events.SUITE_STEP_START, this.step);
    const trace = this.addTraceHeader();
    const data = this.extractRequiredData(resultset);
    const httpRequest = new HttpRequest(this.step, data);
    const result = await httpRequest.execute();
    let stepPassed = false;
    if (result) {
      const assertObject = new AssertObject(result, this.assertions);
      stepPassed = assertObject.assert((err) => {
        this.emit(events.SUITE_STEP_FAIL, this.step, err);
      });
      if (stepPassed) {
        this.emit(events.SUITE_STEP_PASS, this.step);
      }
    }
    this.emit(events.SUITE_STEP_END, this.step);
    return {
      trace,
      step: this.step,
      pass: stepPassed,
      result,
    };
  }

  addTraceHeader() {
    if (!this.step.request.headers) {
      this.step.request.headers = {};
    }
    const token = generateToken();
    this.step.request.headers['X-Upssert-Trace'] = token;
    return token;
  }

  extractRequiredData(results) {
    const data = {};
    if (this.step.requires) {
      this.step.requires.forEach((id) => {
        data[id] = results[id].result;
      });
    }
    return data;
  }

  initialize() {
    const responseSet = !falsy(this.step.response);
    this.addAssertionsIfReponseIsSet(responseSet);
    this.addDefaultPingAssertions(responseSet);
  }

  addAssertionsIfReponseIsSet(responseSet) {
    if (responseSet) {
      Object.keys(this.step.response).forEach((key) => {
        const assertion = this.step.response[key];
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

export default Step;
