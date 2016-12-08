import { assert } from 'chai';
import Test from '../../src/lib/test';

describe('Test', () => {
  it('creates a Test instance with default ping assertions', () => {
    const options = {
      name: 'foobar',
      request: { url: 'http://foobar.com' },
    };
    const test = new Test(options);
    assert.strictEqual(test.name, 'foobar');
    assert.strictEqual(test.request.url, 'http://foobar.com');
    assert.equal(test.assertions.length, 1);
    assert.isOk(test.assertions[0]);
    const assertion = test.assertions[0];
    assert.isOk(assertion.statusCode);
    assert.equal(assertion.statusCode.isAtLeast, 200);
    assert.equal(assertion.statusCode.isBelow, 400);
  });

  it('applies an "equal" assertion if the property assertion value is a string', () => {
    const options = {
      name: 'foobar',
      request: { url: 'http://foobar.com' },
      response: {
        foo: 'bar',
        bar: 'foo',
      },
    };
    const test = new Test(options);
    assert.strictEqual(test.name, 'foobar');
    assert.strictEqual(test.request.url, 'http://foobar.com');
    assert.equal(test.assertions.length, 2);
    const fooAssertion = test.assertions[0];
    assert.isOk(fooAssertion.foo);
    assert.equal(fooAssertion.foo.match, '^bar$');
    const barAssertion = test.assertions[1];
    assert.isOk(barAssertion.bar);
    assert.equal(barAssertion.bar.match, '^foo$');
  });

  it('applies defined assertions for a property', () => {
    const options = {
      name: 'foobar',
      request: { url: 'http://foobar.com' },
      response: {
        foo: { 'strict-equal': 'bar' },
        bar: { 'is-not-boolean': 'foo' },
      },
    };
    const test = new Test(options);
    assert.strictEqual(test.name, 'foobar');
    assert.strictEqual(test.request.url, 'http://foobar.com');
    assert.equal(test.assertions.length, 2);
    const fooAssertion = test.assertions[0];
    assert.isOk(fooAssertion.foo);
    assert.equal(fooAssertion.foo['strict-equal'], 'bar');
    const barAssertion = test.assertions[1];
    assert.isOk(barAssertion.bar);
    assert.equal(barAssertion.bar['is-not-boolean'], 'foo');
  });
});
