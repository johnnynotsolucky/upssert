import Test from './test'

class Suite {
  constructor (suite) {
    Object.assign(this, suite)
    this.assertionCount = 0
    this.tests = this.tests || []
    for (const [index, value] of this.tests.entries()) {
      this.setIdIfNotSet(value, index + 1)
      this.tests[index] = new Test(value)
      this.assertionCount += this.tests[index].assertions.length
    }
  }

  setIdIfNotSet (object, index) {
    if (!object.id) {
      object.id = `test${index}`
    }
    return object
  }
}

export default Suite
