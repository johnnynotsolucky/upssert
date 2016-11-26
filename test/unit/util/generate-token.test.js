import { assert } from 'chai';
import generateToken from '../../../src/lib/util/generate-token';

describe('generateToken', () => {
  it('should return a valid SHA256 hash', () => {
    const token = generateToken();
    assert.equal(token.match(/^[0-9a-f]{64}$/), token);
  });
});
