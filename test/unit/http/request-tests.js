/* eslint-disable no-undef, import/no-extraneous-dependencies */
import { assert } from 'chai';
import HttpRequest from '../../../src/lib/http/request';

describe('HttpRequest', () => {
  it('should create a valid object given just an URL', () => {
    const request = new HttpRequest({ url: 'http://localhost' });
    assert.isOk(request);
    assert.equal(request.url, 'http://localhost');
    assert.equal(request.method, 'GET');
    assert.isNotOk(request.form);
    assert.isNotOk(request.data);
    assert.isTrue(Array.isArray(request.headers));
    assert.equal(request.headers.length, 0);
  });

  it('should render raw data from a model', () => {
    const request = new HttpRequest({ data: '{{foo}}' }, { foo: 'bar' });
    assert.strictEqual(request.data, 'bar');
  });

  it('should render raw data from a complex model', () => {
    const model = {
      foo: {
        bar: 'foobar',
      },
    };
    const request = new HttpRequest({ data: '{{foo.bar}}' }, model);
    assert.strictEqual(request.data, 'foobar');
  });

  it('should generate valid request headers', () => {
    const model = {
      contentType: 'application/json',
    };
    const headers = {
      'Content-Length': '123',
      'Content-Type': '{{& contentType}}',
    };
    const request = new HttpRequest({ headers }, model);
    assert.strictEqual(request.headers.length, 2);
    assert.strictEqual(request.headers[0], 'Content-Length: 123');
    assert.strictEqual(request.headers[1], 'Content-Type: application/json');
  });

  it('should render valid form content', () => {
    const model = {
      foo: {
        bar: 'foobar',
      },
    };
    const content = [
      {
        key: 'foo',
        value: '{{foo.bar}}',
      }, {
        key: 'bar',
        value: 'bar',
      },
    ];
    const request = new HttpRequest({ form: content }, model);
    assert.strictEqual(request.form.length, 2);
    assert.strictEqual(request.form[0], 'foo=foobar');
    assert.strictEqual(request.form[1], 'bar=bar');
  });
});
