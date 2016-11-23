/* eslint-disable no-undef, import/no-extraneous-dependencies */
import { assert } from 'chai';
import jsonParser from '../../../src/lib/parser/json';

describe('JSON Parser', () => {
  it('should correctly parse JSON data as an object', () => {
    const tests = [
      { test: '{ "foo": "bar", "count": 1 }', assert: ['bar', 1] },
      { test: '{ "foo": "bar", "count": 1.10 }', assert: ['bar', 1.1] },
    ];
    for (const test of tests) {
      const obj = jsonParser(test.test);
      assert.isOk(obj);
      assert.strictEqual(obj.foo, test.assert[0]);
      assert.strictEqual(obj.count, test.assert[1]);
    }
  });

  it('should correctly parse a JSON array as an array', () => {
    const tests = [
      { test: '[1, 2, 3, 4]', assert: [4, 'number'] },
      { test: '["foo", "bar"]', assert: [2, 'string'] },
      { test: '[{ "foo": "bar" }, { "a": 10 }]', assert: [2, 'object'] },
    ];
    for (const test of tests) {
      const obj = jsonParser(test.test);
      assert.isOk(obj);
      assert.isArray(obj);
      assert.strictEqual(obj.length, test.assert[0]);
      assert.isTrue(typeof obj[0] === test.assert[1]); // eslint-disable-line valid-typeof
    }
  });

  it('should throw a SyntaxError for invalid JSON', () => {
    const tests = [
      '{foo: "bar"}',
      'foo: bar',
      '"foo": "bar"',
      '{"foo": 1,10}',
    ];

    for (const test of tests) {
      try {
        jsonParser(test);
      } catch (err) {
        assert.isTrue(err instanceof SyntaxError);
      }
    }
  });
});
