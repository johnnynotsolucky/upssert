import { assert } from 'chai'
import time from '../../../src/lib/util/time'

describe('time', () => {
  it('renders time as milliseconds', () => {
    const result = time(100)
    assert.equal(result, '100ms')
  })

  it('renders time as seconds', () => {
    let result = time(1000)
    assert.equal(result, '1.000s')
    result = time(1050)
    assert.equal(result, '1.050s')
  })

  it('renders time as minutes', () => {
    let result = time(60000)
    assert.equal(result, '1.000m')
    result = time(63000)
    assert.equal(result, '1.050m')
  })

  it('renders time as hours', () => {
    let result = time(3600000)
    assert.equal(result, '1.000h')
    result = time(3780000)
    assert.equal(result, '1.050h')
  })
})
