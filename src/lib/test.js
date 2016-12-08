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
      for (const key of Object.keys(this.response)) {
        const assertion = this.response[key];
        this.addEqualAssertionIfString(assertion, key);
        this.addAssertionsIfObject(assertion, key);
      }
    }
  }

  addEqualAssertionIfString(assertion, key) {
    if (typeof assertion === 'string') {
      this.assertions.push({
        [key]: {
          match: this.convertToRegexString(assertion),
        },
      });
    }
  }

  convertToRegexString(assertion) {
    let converted = assertion;
    if (!converted.match(/(^\^)|(\$$)/)) {
      converted = `^${converted}$`;
    }
    return converted;
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
