import { EventEmitter } from 'events';
import falsy from 'falsy';
import { assert } from 'chai';
import camelcase from 'camelcase';
import generateToken from '../generateToken';
import HttpRequest from '../httpRequest';
import events from '../../data/events.json';

const getObjectFromKey = (object, key) => {
  try {
    const properties = key.split('.');
    for (const property of properties) {
      const bracketNotation = property.match(/\[(.*?)]/g);
      if (bracketNotation) {
        const parentProperty = property.substr(0, property.match(/\[/).index);
        object = object[camelcase(parentProperty)];
        for (const part of bracketNotation) {
          object = object[part.replace('[', '').replace(']', '')];
        }
      } else {
        object = object[camelcase(property)];
      }
    }
    return object;
  } catch (err) {
    return null;
  }
};

const assertProperty = (object, property, key) => {
  const value = property[key];
  const assertion = camelcase(key);
  if (!assert[assertion]) {
    throw new Error(`${key} is not a valid assertion`);
  }
  assert[assertion](object, value);
};


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
      stepPassed = this.assert(result);
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
    const object = getObjectFromKey(body, key);
    if (object === undefined || object === null) {
      this.emit(events.SUITE_STEP_FAIL, this.step, new Error(`${key} is not valid`));
    } else {
      Object.keys(assertion[key]).forEach((assertionKey) => {
        const property = assertion[key];
        assertProperty(object, property, assertionKey);
      });
    }
  }
}

export default Step;
