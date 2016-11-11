import { EventEmitter } from 'events';
import httpstat from 'httpstat';
import tv4 from 'tv4';
import falsy from 'falsy';
import schema from './schema/test-case.json';
import { assert } from 'chai';
import camelcase from 'camelcase';
import transposeStatResult from './transposeStatResult';

const events = {
  START: 'start',
  FAIL: 'fail',
  END: 'end',
  STEP: {
    START: 'step.start',
    FAIL: 'step.fail',
    PASS: 'step.pass',
    END: 'step.end',
  },
};

class SuiteExecutor extends EventEmitter {
  constructor(testCase) {
    super();
    this.testCase = testCase;
  }

  async execute() {
    this.emit('start', this.testCase);
    const testValid = tv4.validate(this.testCase, schema);
    if (testValid) {
      await this.executeStepsInOrder(this.testCase.steps);
    } else {
      this.emit('fail', this.testCase, tv4.error);
    }
    this.emit('end', this.testCase);
  }

  async executeStepsInOrder(steps) {
    let previousStepPassed = true;
    for (const step of steps) {
      let stepPassed = true;
      this.emit('step.start', step);
      const needsPreviousStep = step['needs-previous-step'] || false;
      if(needsPreviousStep && !previousStepPassed) {
        this.emit('step.fail', step, new Error('Previous step failed'));
        stepPassed = false;
      } else {
        const result = await this.httpRequest(step, result);
        stepPassed = this.assert(result, step);
      }
      if(stepPassed) {
        this.emit('step.pass', step);
      }
      previousStepPassed = stepPassed;
      this.emit('step.end', step);
    }
  }

  assert(object, step) {
    if(!falsy(step.response)) {
      return this.assertObject(object, step);
    } else {
      return this.assertSimpleObject(object, step);
    }
  }

  assertObject(object, step) {
    let result;
    try {
      Object.keys(step.response).forEach((key) => {
        this.assertObjectProperty(object, step, key);
      });
      result = true;
    } catch (err) {
      this.emit('step.fail', step, err);
      result = false;
    }
    return result;
  }

  assertSimpleObject(object, step) {
    let result;
    try {
      assert.isAtLeast(object.statusCode, 200);
      assert.isBelow(object.statusCode, 400);
      result = true;
    } catch (err) {
      this.emit('step.fail', step, err);
      result = false;
    }
    return result;
  }

  assertObjectProperty(transposed, step, key) {
    const object = this.getObjectFromKey(transposed, key);
    if (!this.failStepIfFalsy(object, step, key)) {
      const property = step.response[key];
      if (typeof property === 'string') {
        assert.equal(object, property);
      } else if (typeof property === 'object') {
        Object.keys(property)
          .forEach((assertionKey) => {
            this.assertProperty(object, property, assertionKey);
          });
      }
    }
  }

  getObjectFromKey(transposed, key) {
    const properties = key.split('.');
    let object = transposed;
    properties.forEach((property) => {
      object = object[camelcase(property)];
    });
    return object;
  }

  failStepIfFalsy(object, step, key) {
    const isFalsy = falsy(object);
    if (isFalsy) {
      this.emit('step.fail', step, new Error(`${key} is not valid`));
    }
    return isFalsy;
  }

  assertProperty(object, property, key) {
    const value = property[key];
    const assertion = camelcase(key);
    if (!assert[assertion]) {
      throw new Error(`${key} is not a valid assertion`);
    }
    assert[assertion](object, value);
  }

  async httpRequest(step, previousResult) {
    const result = await httpstat(step.request.url, {
        method: step.request.method
      });
    const transposed = transposeStatResult(result);
    return transposed;
  }
}

export { SuiteExecutor, events };
