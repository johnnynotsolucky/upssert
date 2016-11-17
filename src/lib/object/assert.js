import { assert } from 'chai';
import camelcase from 'camelcase';
import getObjectValue from './get-value';
import events from '../../data/events.json';

const assertValue = (value, assertAgainst, assertionMethodName) => {
  const expectedValue = assertAgainst[assertionMethodName];
  const assertionMethod = camelcase(assertionMethodName);
  if (!assert[assertionMethod]) {
    throw new Error(`${assertionMethodName} is not a valid assertion`);
  }
  assert[assertionMethod](value, expectedValue);
};

class AssertObject {
  constructor(object, assertions) {
    this.object = object;
    this.assertions = assertions;
  }

  assert(errorCb) {
    let result;
    try {
      this.assertions.forEach(propertyToAssert =>
        this.assertProperty(propertyToAssert, errorCb));
      result = true;
    } catch (err) {
      this.emit(events.SUITE_STEP_FAIL, this.step, err);
      result = false;
    }
    return result;
  }

  assertProperty(propertyToAssert, errorCb) {
    const propertyNameToAssert = Object.keys(propertyToAssert)[0];
    const objectValue = getObjectValue(this.object, propertyNameToAssert);
    if (objectValue === undefined || objectValue === null) {
      if (typeof errorCb === 'function') {
        errorCb(new Error(`${propertyNameToAssert} is not valid`));
      }
    } else {
      const assertAgainst = propertyToAssert[propertyNameToAssert];
      Object.keys(propertyToAssert[propertyNameToAssert])
        .forEach((assertionMethod) => {
          assertValue(objectValue, assertAgainst, assertionMethod);
        });
    }
  }
}


export default AssertObject;
