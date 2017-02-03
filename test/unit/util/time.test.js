import { assert } from 'chai'
import { mapToUnitFormat } from '../../../src/lib/util/time'

describe('time', () => {
  it('renders time as milliseconds', () => {
    const result = mapToUnitFormat(100).value
    assert.equal(result, '100ms')
  })

  it('renders time as seconds', () => {
    let result = mapToUnitFormat(1000).value
    assert.equal(result, '1.000s')
    result = mapToUnitFormat(1050).value
    assert.equal(result, '1.050s')
  })

  it('renders time as minutes', () => {
    let result = mapToUnitFormat(60000).value
    assert.equal(result, '1.000m')
    result = mapToUnitFormat(63000).value
    assert.equal(result, '1.050m')
  })

  it('renders time as hours', () => {
    let result = mapToUnitFormat(3600000).value
    assert.equal(result, '1.000h')
    result = mapToUnitFormat(3780000).value
    assert.equal(result, '1.050h')
  })
})
