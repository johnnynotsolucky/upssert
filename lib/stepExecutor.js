import { EventEmitter } from 'events';
import httpstat from 'httpstat';
import falsy from 'falsy';
import { assert } from 'chai';
import camelcase from 'camelcase';
import transposeStatResult from './transposeStatResult';

const events = {
  START: 'start',
  FAIL: 'fail',
  PASS: 'pass',
  END: 'end',
  COUNT: 'count',
};

class StepExecutor extends EventEmitter {
  constructor(step) {
    super();
    this.step = step;
    this.assertions = [];
  }
  
  async execute(previousResults) {
    this.initialize();
    this.emit(events.START, this.step);
    const result = await this.httpRequest();
    const stepPassed = this.assert(result);
    if(stepPassed) {
      this.emit(events.PASS, this.step);
    }
    this.emit(events.END, this.step);
  }

  initialize() {
    if(!falsy(this.step.response)) {
      Object.keys(this.step.response).forEach((key) => {
        const assertion = this.step.response[key];
        if(typeof assertion === 'string') {
          this.assertions.push({
            [key]: {
              equal: assertion,
            },
          });
          this.emit(events.COUNT, 1);
        } else {
          this.assertions.push({
            [key]: assertion,
          });
          this.emit(events.COUNT, Object.keys(assertion).length);
        }
      });
    } else {
      this.assertions.push({
        statusCode: {
          isAtLeast: 200,
          isBelow: 400,
        },
      });
      this.emit(events.COUNT, 2);
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
      this.emit(events.FAIL, this.step, err);
      result = false;
    }
    return result;
  }

  assertObjectProperty(body, assertion) {
    const key = Object.keys(assertion)[0];
    const object = this.getObjectFromKey(body, key);
    if(falsy(object)) {
      this.emit(events.FAIL, this.step, new Error(`${key} is not valid`));
    } else {
      Object.keys(assertion[key])
        .forEach((assertionKey) => {
          const property = assertion[key];
          this.assertProperty(object, property, assertionKey);
        });
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
    const result = await httpstat(this.step.request.url, {
        method: this.step.request.method
      });
    const object = transposeStatResult(result);
    return object;
  }
}

export { StepExecutor, events };
