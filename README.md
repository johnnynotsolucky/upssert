<br><br>
<p align="center">
  <img src="https://cdn.rawgit.com/upssert/upssert/master/media/arvakr.svg"
    style="background: transparent; width: 200px; height: 200px;"
    alt="Upssert REST API assertion framework"/>
</p>
<br><br>

# Upssert

[![Build Status](https://travis-ci.org/upssert/upssert.svg?branch=master)](https://travis-ci.org/upssert/upssert)
[![Coverage Status](https://coveralls.io/repos/github/upssert/upssert/badge.svg)](https://coveralls.io/github/upssert/upssert)
[![Dependencies](https://david-dm.org/upssert/upssert.svg)](https://david-dm.org/upssert/upssert)

Upssert is an extremely simple REST API assertion framework which makes it easier to monitor and test your API.
Without writing any code, test your API against its responsiveness and any combination of parameters.

## Principles

 - Zero configuration setup
 - Human-readable test suite definitions
 - Repeatable across environments
 - Assert anything
 - Stay easy

## Installation

    npm install upssert

## Usage

    $ upssert --url http://httpbin.org/get

    Executing 1 test suites (2 assertions)…

    Ping
      ✓ http://httpbin.org/get

    1 passing (204.000ms)


By default Upssert will assert that a URL's response code is within the 200 or 300 range, i.e.

    $ node ./dist/bin/index.js --url https://httpbin.org/status/404

    Executing 1 test suites (2 assertions)…

    Ping
      ✖ https://httpbin.org/status/404

    1) https://httpbin.org/status/404
    Error: expected 404 to be below 400 (statusCode)

    0 passing (418.000ms)
    1 failing

### Assertions

Under the hood, Upssert uses [Chai Assertion Library's](http://chaijs.com/) [`assert`](http://chaijs.com/api/assert/) API
for its assertions. All the assertions exposed by Chai are available in Upssert with the exception of:

 - `assert(expression, message)`
 - `throws`
 - `doesNotThrow`
 - `changes`
 - `doesNotChange`
 - `increases`
 - `doesNotIncrease`
 - `decreases`
 - `doesNotDecrease`

The following will be supported in the future

 - `operater`
 - `closeTo`
 - `approximately`

### CLI

#### Options

 - `url` Supply Upssert with a URL to run a ping assertion against
 - `reporter` Tell Upssert which reporter to use. Options are `tap` and `console`. Defaults to `console`

If neither a glob pattern or `--url` flag is supplied, Upssert will look in `test/api/**/*.json` for test suites.
Alternatively, Upssert can be configured within `package.json` with the following options:

    {
      ...
      "upssert": {
        "globOpts": {},
        "testDir": "path/to/your/tests/**/*.json"
      }
    }

`globOpts` can be configured as defined in [https://github.com/isaacs/node-glob]()

#### Running Test Suites

Test suites are defined as JSON files

    $ cat << EOF > ping.json
    {
      "name": "Ping httpbin.org",
      "tests": [
        {
          "name": "Successfully pings httpbin.org",
          "request": {
            "url": "https://httpbin.org",
            "method": "GET"
          }
        }
      ]
    }
    EOF

    $ upssert ping.json

A more complex example

    $ cat << EOF > workflow.json
    {
      "name": "Test against httpbin",
      "tests": [
        {
          "name": "/get",
          "request": {
            "url": "https://httpbin.org/get?foo=bar",
            "method": "GET"
          },
          "response": {
            "content-type": "application/json",
            "status-code": {
              "equal": 200
            },
            "timing.dns-resolution": {
              "is-below": 100
            },
            "timing.total": {
              "is-below": 500
            },
            "body.args.foo": "bar"
          }
        }, {
          "name": "/post formdata",
          "requires": ["test1"],
          "request": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "form": [
              {
                "key": "out",
                "value": "{{test1.body.args.foo}}"
              }
            ]
          },
          "response": {
            "content-type": "application/json",
            "status-code": {
              "equal": 200
            },
            "timing.dns-resolution": {
              "is-below": 100
            },
            "timing.total": {
              "is-below": 500
            },
            "body.form.out": "bar"
          }
        }, {
          "name": "/post raw data",
          "requires": ["test1", "test2"],
          "request": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": "test1-data={{test1.body.args.foo}}&test2-data={{test2.body.form.out}}"
          },
          "response": {
            "content-type": "application/json",
            "status-code": {
              "equal": 200
            },
            "timing.dns-resolution": {
              "is-below": 100
            },
            "timing.total": {
              "is-below": 500
            },
            "body.form[test1-data]": "bar",
            "body.form[test2-data]": "bar"
          }
        }
      ]
    }
    EOF

    $ upssert workflow.json

### Programmatically

    import Upssert from 'upssert';
    const ping = {
      name: 'Ping httpbin.org',
      tests: [
        {
          name: 'Successfully pings httpbin.org',
          request: {
            url: 'https://httpbin.org',
            method: 'GET',
          },
        },
      ],
    }

    const upssert = new Upssert(ping);
    upssert.execute();

#### Reporters

Currently, there are only two reporters available

##### ConsoleReporter (default)

Similar to [Mocha](https://mochajs.org/) Spec reporter.

##### TapReporter

Outputs test reports with the [TAP specification](https://testanything.org/tap-specification.html)


    import Upssert, { TapReporter } from 'upssert';
    const reporter = new TapReporter();
    const upssert = new Upssert('https://httpbin.org/get', reporter);
    upssert.execute();

    1..1
    ok 1 https://httpbin.org/get
    # tests 1
    # pass 1
    # fail 0
    # assertions 2

#### Lifecycle

Upssert uses the `EventEmitter` to emit events at runtime. The bundled reporters report on
events as they occur instead of collecting all output first and then writing out the formatted
report.

The following is an exhaustive list of events which are emitted

 - `suite.assertion.count (count)` emits `count` assertions for each test
 - `suite.test.count (count)` emits `count` tests for each suite
 - `suite.count (count)` emits `count` for each suite, which is usually `1`
 - `start` emitted when the test runner starts
 - `suite.start` emitted when a suite starts
 - `suite.fail` emitted if a suite fails and cannot continue. Generally for invalid test suite configuration.
 - `suite.test.start` emitted when a test starts
 - `suite.test.pass` emitted if none of the tests assertions fail
 - `suite.test.fail` emitted if any of the tests assertions fail
 - `suite.test.end` emitted when a test ends
 - `fail` emitted for every failure (`suite.test.fail`, `suite.fail`). Useful for marking a test run as failed.
 - `suite.end` emitted when a suite ends
 - `end` emitted when the test runner stops

#### Custom Reporters

User-defined reporters can be passed to Upssert through the constructor.

A custom implementation only requires that it expose a `setEventEmitter(emitter)` method which Upssert can
pass an event emitter into.

    class CustomReporter {
      setEventEmitter(emitter){
        emitter.on('start', () => console.log('Started'));
        emitter.on('end', () => console.log('Ended'));
      }
    }

    const upssert = new Upssert('https://httpbin.org/get', new CustomReporter());
    upssert.execute();

*Inspired by the simplicity of [Ansible](https://www.ansible.com/)*

## License

[Apache 2.0](LICENSE)
