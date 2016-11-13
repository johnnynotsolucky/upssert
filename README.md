# Upssert

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


    upssert path/to/my/test.json

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
