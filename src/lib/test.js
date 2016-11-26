import falsy from 'falsy';

class Test {
  constructor(test) {
    Object.assign(this, test);
    this.assertions = [];
    const responseSet = !falsy(this.response);
    this.addAssertionsIfReponseIsSet(responseSet);
    this.addDefaultPingAssertions(responseSet);
  }

  addAssertionsIfReponseIsSet(responseSet) {
    if (responseSet) {
      Object.keys(this.response).forEach((key) => {
        const assertion = this.response[key];
        this.addEqualAssertionIfString(assertion, key);
        this.addAssertionsIfObject(assertion, key);
      });
    }
  }

  addEqualAssertionIfString(assertion, key) {
    if (typeof assertion === 'string') {
      this.assertions.push({
        [key]: {
          equal: assertion,
        },
      });
    }
  }

  addAssertionsIfObject(assertion, key) {
    if (typeof assertion === 'object') {
      this.assertions.push({
        [key]: assertion,
      });
    }
  }

  addDefaultPingAssertions(responseSet) {
    if (!responseSet) {
      this.assertions.push({
        statusCode: {
          isAtLeast: 200,
          isBelow: 400,
        },
      });
    }
  }
}

export default Test;
