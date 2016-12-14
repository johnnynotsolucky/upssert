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
      Object.keys(assertAgainst)
        .forEach((assertionMethod) => {
          try {
            this.assertValue(objectValue, assertAgainst, assertionMethod);
          } catch (err) {
            const params = [
              objectValue,
              assertAgainst[assertionMethod],
              propertyNameToAssert,
              err,
            ];
            err.message = this.getAssertionMessage(...params);
            throw err;
          }
        });
    }
  }

  assertValue(value, assertAgainst, assertionMethodName) {
    let expectedValue = this.getExpectedValue(assertAgainst[assertionMethodName]);
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
    expectedValue = this.renderValue(expectedValue);
    expectedValue = this.createRegExpIfRequired(assertionMethod, expectedValue);
    assert[assertionMethod](value, expectedValue);
  }

  getExpectedValue(val) {
    let result;
    if (typeof val === 'object') {
      result = val.value;
    } else {
      result = val;
    }
    return result;
  }

  getAssertionMessage(actual, expect, propertyName, err) {
    let result;
    if (typeof expect === 'object') {
      const model = {
        actual,
        expected: expect.value,
      };
      result = render(expect.message, model);
    } else {
      result = err.message;
    }
    result = `${result} (${propertyName})`;
    return result;
  }

  createRegExpIfRequired(assertionMethod, regexStr) {
    let result = regexStr;
    if (assertionMethod === 'match' || assertionMethod === 'notMatch') {
      result = new RegExp(regexStr);
    }
    return result;
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
