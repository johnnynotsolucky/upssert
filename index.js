const main = require('./lib/executeTestCase');

module.exports = main({
  name: 'Test',
  workflow: [
    {
      name: 'Something',
      request: {
        url: 'http://httpbin.org/get',
        method: 'GET'
      }
    }
  ]
});
