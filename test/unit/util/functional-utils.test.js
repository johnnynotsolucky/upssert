import { assert } from 'chai'
import { cryptoString } from '../../../src/lib/util/functional-utils'

describe('utils', () => {
  describe('cryptoString', () => {
    it('should return a valid SHA256 hash', () => {
      const token = cryptoString(32, 'hex')
      assert.equal(token.match(/^[0-9a-f]{64}$/), token)
    })
  })
})
