import { assert } from 'chai'
import AssertObject from '../../../src/lib/object/assert'

describe('AssertObject', () => {
  it('should pass an assertion of a property in an object', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {
        equal: 'bar'
      }
    }
    const result = new AssertObject(object, [assertion]).assert()
    assert.strictEqual(result, true)
  })

  it('should fail an assertion of a property in an object', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {
        equal: 1
      }
    }
    const result = new AssertObject(object, [assertion]).assert()
    assert.strictEqual(result, false)
  })

  it('should call the error callback when an invalid property is passed', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      oof: {
        equal: 1
      }
    }
    const result = new AssertObject(object, [assertion]).assert((err) => {
      assert.strictEqual(err.message, 'oof is not valid')
    })
    assert.strictEqual(result, false)
  })

  it('should call the error callback when an invalid assertion is passed', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {
        'is-equal': 1
      }
    }
    const result = new AssertObject(object, [assertion]).assert((err) => {
      assert.strictEqual(err.message, 'is-equal is not a valid assertion (foo)')
    })
    assert.strictEqual(result, false)
  })

  it('should call the error callback when an empty assertion is passed', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {
        '': 1
      }
    }
    const result = new AssertObject(object, [assertion]).assert((err) => {
      assert.strictEqual(err.message, 'Invalid assertion (foo)')
    })
    assert.strictEqual(result, false)
  })

  it('returns true if no assertions provided for a property', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {}
    }
    const result = new AssertObject(object, [assertion]).assert()
    assert.strictEqual(result, true)
  })

  it('should pass multiple assertions for a property', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {
        equal: 'bar',
        'strict-equal': 'bar'
      }
    }
    const result = new AssertObject(object, [assertion]).assert()
    assert.strictEqual(result, true)
  })

  it('should pass multiple assertions for an object', () => {
    const object = {
      foo: 'bar'
    }
    const assertions = []
    for (let i = 0; i < 6; i++) {
      assertions.push({
        foo: {
          equal: 'bar',
          'strict-equal': 'bar'
        }
      })
    }
    const result = new AssertObject(object, assertions).assert()
    assert.strictEqual(result, true)
  })

  it('should pass assertions which only require the property as a parameter', () => {
    const object = {
      foo: 'bar',
      bar: null
    }
    const assertions = [{
      foo: {
        'is-ok': true
      }
    }, {
      bar: {
        'is-not-ok': true
      }
    }]
    const result = new AssertObject(object, assertions).assert()
    assert.strictEqual(result, true)
  })

  it('should fail an assertion of a property in an object', () => {
    const object = {
      foo: 'bar'
    }
    const assertion = {
      foo: {
        equal: {
          value: 1,
          message: 'foo should equal {{expected}}, got "{{actual}}"'
        }
      }
    }
    const result = new AssertObject(object, [assertion]).assert((err) => {
      assert.strictEqual(err.message, 'foo should equal 1, got "bar" (foo)')
    })
    assert.strictEqual(result, false)
  })
})
