import Runner from './lib/runner';
import TAP from './lib/reporter/tap';

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

  new TAP(runner);
  runner.run();
}

export default run();
