import { assert } from 'chai';
import validateSuite from '../../src/lib/validate-suite';

describe('validateSuite', () => {
  it('returns true with just required fields provided', () => {
    const suite = { name: 'foobar' };
    assert.strictEqual(validateSuite(suite), true);
  });

  it('returns an error if required fields not provided', () => {
    const result = validateSuite({});
    assert.isObject(result, true);
    assert.isOk(result.message);
    assert.equal(result.message, 'Missing required property: name');
  });

  it('returns an error for invalid property types', () => {
    const result = validateSuite({ name: {} });
    assert.isObject(result, true);
    assert.isOk(result.message);
    assert.equal(result.message, 'Invalid type: object (expected string)');
  });

  it('allows an empty array of items', () => {
    const suite = {
      name: 'foobar',
      items: [],
    };
    assert.strictEqual(validateSuite(suite), true);
  });

  it('returns error if required test fields are missing', () => {
    let suite = {
      name: 'foobar',
      tests: [{}],
    };
    let result = validateSuite(suite);
    assert.isObject(result, true);
    assert.isOk(result.message);
    assert.equal(result.message, 'Missing required property: name');
    suite = {
      name: 'foo',
      tests: [{ name: 'foo' }],
    };
    result = validateSuite(suite);
    assert.isObject(result, true);
    assert.isOk(result.message);
    assert.equal(result.message, 'Missing required property: request');
  });
});
