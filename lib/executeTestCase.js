const httpstat = require('httpstat');
const tv4 = require('tv4');
const schema = require('./schema/configuration.json');

const assert = require('chai').assert;
const camelcase = require('camelcase');

module.exports = async (config) => {
  const results = [];
  const executeStepsInOrder = async (config, steps) => {
    let result;
    for (const step of config.workflow) {
      result = await executeStep(step, result);

      const transposed = require('./transposeStatResult')(result);
      // console.log(transposed);

      if (step.response['content-type']) {
        assert.equal(transposed.contentType, step.response['content-type']);
      }

      if (step.response['status']) {
        Object.keys(step.response['status']).forEach((key) => {
          const value = step.response['status'][key];
          const assertion = camelcase(key);
          assert[assertion](transposed.code, value);
        });
      }

      if (step.response['response-time']) {
        Object.keys(step.response['response-time']).forEach((key) => {
          const value = step.response['response-time'][key];
          const assertion = camelcase(key);
          assert[assertion](transposed.timing.total, value);
        });
      }

      Object.keys(step.response).forEach((key) => {
        // noOp for now
      });

      results.push({
        step,
        result: transposed,
      });
    }
  };

  const executeStep = async (step, previousResult) => {
    const result = await httpstat(step.request.url, {
        method: step.request.method
      });
    return result;
  };

  const configValid = tv4.validate(config, schema);
  if (configValid) {
    await executeStepsInOrder(config, config.workflow);
    return results;
  } else {
    throw tv4.error;
  }
};
