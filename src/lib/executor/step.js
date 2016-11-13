import { EventEmitter } from 'events';
import httpstat from 'httpstat';
import falsy from 'falsy';
import { assert } from 'chai';
import camelcase from 'camelcase';
import transposeStatResult from './transposeStatResult';
import events from '../../data/events.json';

class Step extends EventEmitter {
  constructor(step) {
    super();
    this.step = step;
    this.assertions = [];
  }

  async execute(previousResults) {
    this.emit(events.SUITE_STEP_START, this.step);
    const data = this.extractRequiredData(previousResults);
    const result = await this.httpRequest();
    let stepPassed = false;
    if(result) {
      stepPassed = this.assert(result);
      if(stepPassed) {
        this.emit(events.SUITE_STEP_PASS, this.step);
      }
    }
    this.emit(events.SUITE_STEP_END, this.step);
    return {
      step: this.step,
      pass: stepPassed,
      result,
    };
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
      for(const key in this.step.response) {
        const assertion = this.step.response[key];
        this.addEqualAssertionIfString(assertion, key);
        this.addAssertionsIfObject(assertion, key);
      }
    }
  }

  addEqualAssertionIfString(assertion, key) {
    if(typeof assertion === 'string') {
      this.assertions.push({
        [key]: {
          equal: assertion,
        },
      });
      this.emit(events.SUITE_ASSERTION_COUNT, 1);
    }
  }

  addAssertionsIfObject(assertion, key) {
    if(typeof assertion === 'object') {
      this.assertions.push({
        [key]: assertion,
      });
      this.emit(events.SUITE_ASSERTION_COUNT, Object.keys(assertion).length);
    }
  }

  addDefaultPingAssertions(responseSet) {
    if(!responseSet) {
      this.assertions.push({
        statusCode: {
          isAtLeast: 200,
          isBelow: 400,
        },
      });
      this.emit(events.SUITE_ASSERTION_COUNT, 2);
    }
  }

  assert(object) {
    let result;
    try {
      this.assertions.forEach((assertion) => {
        this.assertObjectProperty(object, assertion);
      });
      result = true;
    } catch (err) {
      this.emit(events.SUITE_STEP_FAIL, this.step, err);
      result = false;
    }
    return result;
  }

  assertObjectProperty(body, assertion) {
    const key = Object.keys(assertion)[0];
    const object = this.getObjectFromKey(body, key);
    if(falsy(object)) {
      this.emit(events.SUITE_STEP_FAIL, this.step, new Error(`${key} is not valid`));
    } else {
      for(const assertionKey in assertion[key]) {
          const property = assertion[key];
          this.assertProperty(object, property, assertionKey);
        };
    }
  }

  getObjectFromKey(object, key) {
    const properties = key.split('.');
    properties.forEach((property) => {
      object = object[camelcase(property)];
    });
    return object;
  }

  assertProperty(object, property, key) {
    const value = property[key];
    const assertion = camelcase(key);
    if (!assert[assertion]) {
      throw new Error(`${key} is not a valid assertion`);
    }
    assert[assertion](object, value);
  }

  async httpRequest(previousResult) {
    try {
    const result = await httpstat(this.step.request.url, {
        method: this.step.request.method
      });
    //TODO use mustache templating and add post data, etc
    const object = transposeStatResult(result);
    return object;
    } catch (err) {
      this.emit(events.SUITE_STEP_FAIL, this.step, err);
      return false;
    }
  }
}

export default Step;
