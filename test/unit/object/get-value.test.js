import { assert } from 'chai';
import getObjectValue from '../../../src/lib/object/get-value';

describe('getObjectValue', () => {
  it('should return the correct value of a property of an object', () => {
    const object = { foo: 'bar' };
    const foo = getObjectValue(object, 'foo');
    assert.isOk(foo);
    assert.strictEqual(foo, 'bar');
  });

  it('should return the correct value of a nested object\'s property', () => {
    const object = { foo: { bar: { foobar: 99 } } };
    const foobar = getObjectValue(object, 'foo.bar.foobar');
    assert.isOk(foobar);
    assert.strictEqual(foobar, 99);
  });

  it('should return the correct value of a property with bracket notation', () => {
    const object = { foo: { bar: { foobar: 99 } } };
    const foobar = getObjectValue(object, 'foo[bar][foobar]');
    assert.isOk(foobar);
    assert.strictEqual(foobar, 99);
  });

  it('should return the correct value of a property with mixed notation', () => {
    const object = { foo: { bar: { foobar: 99 } } };
    let foobar = getObjectValue(object, 'foo.bar[foobar]');
    assert.isOk(foobar);
    assert.strictEqual(foobar, 99);
    foobar = getObjectValue(object, 'foo[bar].foobar');
    assert.isOk(foobar);
    assert.strictEqual(foobar, 99);
  });

  it('should return undefined is property does not exist', () => {
    let object = {};
    let foo = getObjectValue(object, 'foo');
    assert.isNotOk(foo);
    assert.strictEqual(foo, undefined);
    object = { foo: { bar: 0 } };
    foo = getObjectValue(object, 'foo.rab');
    assert.isNotOk(foo);
    assert.strictEqual(foo, undefined);
  });

  it('should return the original object if the key is falsy', () => {
    const object = { foo: 'bar' };
    const original = getObjectValue(object, '');
    assert.isOk(original);
    assert.strictEqual(original, object);
  });

  it('should return the undefined if query starts with bracket notation', () => {
    const object = { foo: 'bar' };
    const foo = getObjectValue(object, '[foo]');
    assert.isNotOk(foo);
    assert.strictEqual(foo, undefined);
  });
});
