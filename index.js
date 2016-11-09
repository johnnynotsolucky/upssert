const main = require('./lib/executeTestCase');

module.exports = main({
  name: 'Test',
  workflow: [
    {
      name: 'Something',
      request: {
        url: 'https://httpbin.org/get?a=b',
        method: 'GET'
      },
      response: {
        'content-type': 'application/json',
        'status': {
          'is-at-least': 200,
          'is-below': 300,
        },
        'response-time': {
          'is-below': 400
        }
      }
    },
  ]
}).then((results) => {
  results.forEach((output) => {
    console.log(output.result);
  });
})
.catch((err) => {
  if (err.name === 'ValidationError') {
    console.log('ValidationError');
  } else if (err.name === 'AssertionError') {
    console.log(err.message);
  } else {
    console.log(err);
  }
});
