import { assert } from 'chai';
import camelcase from 'camelcase';
import getObjectValue from './get-value';
import render from '../util/render';

class AssertObject {
  constructor(object, assertions, model, config) {
    this.object = object;
    this.assertions = assertions;
    this.model = model;
    this.unescaped = config && config.unescaped;
  }

  assert(errorCb) {
    let result;
    try {
      this.assertions.forEach(propertyToAssert =>
        this.assertProperty(propertyToAssert, errorCb));
      result = true;
    } catch (err) {
      if (typeof errorCb === 'function') {
        errorCb(err);
      }
      result = false;
    }
    return result;
  }

  assertProperty(propertyToAssert) {
    const propertyNameToAssert = Object.keys(propertyToAssert)[0];
    const objectValue = getObjectValue(this.object, propertyNameToAssert);
    if (objectValue === undefined) {
      throw new Error(`${propertyNameToAssert} is not valid`);
    } else {
      const assertAgainst = propertyToAssert[propertyNameToAssert];
      Object.keys(propertyToAssert[propertyNameToAssert])
        .forEach((assertionMethod) => {
          try {
            this.assertValue(objectValue, assertAgainst, assertionMethod);
          } catch (err) {
            err.message = `${err.message} (${propertyNameToAssert})`;
            throw err;
          }
        });
    }
  }

  assertValue(value, assertAgainst, assertionMethodName) {
    const expectedValue = assertAgainst[assertionMethodName];
    const assertionMethod = camelcase(assertionMethodName);
    if (!assert[assertionMethod]) {
      let message;
      if (assertionMethodName.trim().length === 0) {
        message = 'Invalid assertion';
      } else {
        message = `${assertionMethodName} is not a valid assertion`;
      }
      throw new Error(message);
    }

    assert[assertionMethod](value, this.renderValue(expectedValue));
  }

  renderValue(value) {
    let result;
    if (typeof value === 'string') {
      result = render(value, this.model, this.unescaped);
    } else {
      result = value;
    }
    return result;
  }
}


export default AssertObject;
