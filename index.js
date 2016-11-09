import main from './lib/executeTestCase';

export default main({
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
        'status-code': {
          'equal': 200,
        },
        'timing.dns-resolution': {
          'is-below': 1,
        },
        'timing.total': {
          'is-below': 500
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
  } else if (err.name === 'ErrorContainer') {
    err.errors.forEach((error) => console.log(error.message));
  } else {
    console.log(err);
  }
});
