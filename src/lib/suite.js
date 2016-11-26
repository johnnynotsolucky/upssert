import Test from './test';

class Suite {
  constructor(suite) {
    Object.assign(this, suite);
    this.assertionCount = 0;
    let i = 1;
    for (const [index, value] of this.tests.entries()) {
      if (!value.id) {
        value.id = `test${i}`;
        i += 1;
      }
      this.tests[index] = new Test(value);
      this.assertionCount += this.tests[index].assertions.length;
    }
  }
}

export default Suite;
