import { assert } from 'chai';
import Suite from '../../src/lib/suite';
import Test from '../../src/lib/test';

describe('Suite', () => {
  it('sets the ID of a suite if not already defined', () => {
    let suite = Suite.setIdIfNotSet({}, 2);
    assert.strictEqual(suite.id, 'test2');
    suite = Suite.setIdIfNotSet({}, 0);
    assert.strictEqual(suite.id, 'test0');
  });

  it('applies suite options to the instance', () => {
    const suite = new Suite({ name: 'foobar' });
    assert.isOk(suite);
    assert.strictEqual(suite.name, 'foobar');
    assert.equal(suite.tests.length, 0);
  });

  it('adds Test instances for defined tests', () => {
    const suite = new Suite({
      name: 'foobar',
      tests: [{
        name: 'foo',
        request: { url: 'http://foobar.com' },
      }, {
        name: 'bar',
        id: '__bar',
        request: { url: 'http://foobar.com' },
      }],
    });
    assert.isOk(suite);
    assert.equal(suite.tests.length, 2);
    assert.equal(suite.assertionCount, 2);
    assert.instanceOf(suite.tests[0], Test);
    assert.instanceOf(suite.tests[1], Test);
    assert.strictEqual(suite.tests[0].id, 'test1');
    assert.strictEqual(suite.tests[1].id, '__bar');
  });
});
