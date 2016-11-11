import Runner from './lib/runner';
function run() {
  const runner = new Runner([
      { name: 'Test',
        steps: [
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
                'is-below': 100,
              },
              'timing.total': {
                'is-below': 500
              }
            }
          }, {
            name: 'Something else',
            'needs-previous-step': false,
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
                'is-below': 100,
              },
              'timing.total': {
                'is-below': 500
              }
            }
          },
        ]
    }
  ]);
  runner.on('start', () => console.log('start'));
  runner.on('fail', (obj, err) => console.log('fail', err));
  runner.on('end', () => console.log('end'));
  runner.on('suite.start', (obj) => console.log('suite.start'));
  runner.on('suite.end', () => console.log('suite.end'));
  runner.on('suite.step.start', () => console.log('suite.step.start'));
  runner.on('suite.step.end', () => console.log('suite.step.end'));
  runner.on('suite.step.pass', () => console.log('suite.step.pass'));
  runner.on('suite.step.fail', (obj, err) => console.log('suite.step.fail', err));
  runner.run();
}

export default run();
