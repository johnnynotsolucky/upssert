/* eslint-disable no-undef, import/no-extraneous-dependencies */
import { assert } from 'chai';
import render from '../../../src/lib/util/render';

describe('render', () => {
  it('should correctly apply an object model to a view', () => {
    const rendered = render('{{foo}}', { foo: 'bar' });
    assert.strictEqual(rendered, 'bar');
  });

  it('should correctly apply an object path to a view', () => {
    const foobar = {
      foo: {
        bar: 'foobar',
      },
    };
    const rendered = render('{{foo.bar}}', foobar);
    assert.strictEqual(rendered, 'foobar');
  });

  it('should not be able to apply expressions', () => {
    const foobar = {
      foo: 'foo',
      bar: 'bar',
    };
    const rendered = render('{{foo + bar}}', foobar);
    assert.strictEqual(rendered, '');
  });

  it('should correctly apply an array of models to a view', () => {
    const arr = [
      { foo: 'bar' },
      { foo: 'bar' },
    ];
    const rendered = render('{{#.}}{{foo}}{{/.}}', arr);
    assert.strictEqual(rendered, 'barbar');
  });

  it('should throw an exception if the view template is invalid', () => {
    assert.throws(() => { render('{{#}}'); }, Error, /^Unclosed section/);
    assert.throws(() => { render('{{#.}}'); }, Error, /^Unclosed section/);
  });

  it('should throw an exception if the view is not a string', () => {
    assert.throws(() => { render({}, {}); },
      Error, /^Invalid template! Template should be a "string" but "object"/);
    assert.throws(() => { render([], {}); },
      Error, /^Invalid template! Template should be a "string" but "array"/);
    assert.throws(() => { render(undefined, {}); },
      Error, /^Invalid template! Template should be a "string" but "undefined"/);
    assert.throws(() => { render(null, {}); },
      Error, /^Invalid template! Template should be a "string" but "object"/);
    assert.throws(() => { render(1, {}); },
      Error, /^Invalid template! Template should be a "string" but "number"/);
    assert.throws(() => { render(false, {}); },
      Error, /^Invalid template! Template should be a "string" but "boolean"/);
  });

  it('renders special characters as plain text', () => {
    const rendered = render('{{value}}', { value: 'http://' }, true);
    assert.strictEqual(rendered, 'http://');
  });

  it('renders special characters as html entities', () => {
    const rendered = render('{{value}}', { value: 'http://' });
    assert.strictEqual(rendered, 'http:&#x2F;&#x2F;');
  });
});
