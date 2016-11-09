import httpstat from 'httpstat';
import tv4 from 'tv4';
import falsy from 'falsy';
import schema from './schema/configuration.json';
import ErrorContainer from './errorContainer.js';
import { assert } from 'chai';
import camelcase from 'camelcase';

export default async (config) => {
  const executeStepsInOrder = async (config, steps) => {
    const results = [];
    const errors = [];
    let result;
    for (const step of config.workflow) {
      result = await executeStep(step, result);

      const transposed = require('./transposeStatResult')(result);

      Object.keys(step.response).forEach((key) => {
        const properties = key.split('.');
        let object = transposed;
        properties.forEach((property) => {
          object = object[camelcase(property)];
        });
        if (falsy(object)) {
          errors.push(new Error(`${key} is not valid`));
        } else {
          const property = step.response[key];
          if (typeof property === 'string') {
            assert.equal(object, property);
          } else if (typeof property === 'object') {
            Object.keys(property).forEach((assertionKey) => {
              try {
                const value = property[assertionKey];
                const assertion = camelcase(assertionKey);
                if (assert[assertion]) {
                  assert[assertion](object, value);
                } else {
                  errors.push(new Error(`${assertionKey} is not a valid assertion`));
                }
              } catch (err) {
                errors.push(err);
              }
            });
          }
        }
      });

      results.push({
        step,
        result: transposed,
      });
    }
    return {
      results,
      errors,
    };
  };

  const executeStep = async (step, previousResult) => {
    const result = await httpstat(step.request.url, {
        method: step.request.method
      });
    return result;
  };

  const configValid = tv4.validate(config, schema);
  if (configValid) {
    const results = await executeStepsInOrder(config, config.workflow);
    if(results.errors) {
      throw new ErrorContainer(results.errors);
    }
    return results.results;
  } else {
    throw tv4.error;
  }
};
