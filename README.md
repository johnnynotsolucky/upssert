# Upssert

[![Build Status](https://travis-ci.org/upssert/upssert.svg?branch=master)](https://travis-ci.org/upssert/upssert)
[![Coverage Status](https://coveralls.io/repos/github/upssert/upssert/badge.svg)](https://coveralls.io/github/upssert/upssert)

Does more than just ping! Upssert is a simple and extensible language agnostic REST endpoint assertion framework.

## Installation

_TODO_

## Usage

### CLI

Tests are defined as JSON files

    {
      "name": "Ping httpbin.org",
      "steps": [
        {
          "name": "Successfully pings httpbin.org",
          "request": {
            "url": "https://httpbin.org",
            "method": "GET"
          }
        }
      ]
    }


    $ upssert ping.json

A more complex example

    {
      "name": "Test against httpbin",
      "steps": [
        {
          "name": "/get",
          "request": {
            "url": "https://httpbin.org/get?foo=bar",
            "method": "GET"
          },
          "response": {
            "content-type": "application/json",
            "status-code": {
              "equal": 200,
              "is-at-least": 199
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
          "requires": ["step1"],
          "request": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "form": [
              {
                "key": "out",
                "value": "{{step1.body.args.foo}}"
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
          "requires": ["step1", "step2"],
          "request": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": "step1-data={{step1.body.args.foo}}&step2-data={{step2.body.form.out}}"
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
            "body.form[step1-data]": "bar",
            "body.form[step2-data]": "bar"
          }
        }
      ]
    }

    $ upssert workflow.json

### Programmatically

    var Upssert = require('upssert');
    var ping = {
      name: 'Ping httpbin.org',
      steps: [
        {
          name: 'Successfully pings httpbin.org',
          request: {
            url: 'https://httpbin.org',
            method: 'GET'
          }
        }
      ]
    }

    new Upssert().execute(ping);
