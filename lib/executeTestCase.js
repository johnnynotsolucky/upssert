const httpstat = require('httpstat');
const tv4 = require('tv4');
const schema = require('./schema/configuration.json');

module.exports = (config) => {
  return new Promise((resolve, reject) => {
    const configValid = tv4.validate(config, schema);
    if (configValid) {
      let request;
      config.workflow.forEach((step) => {
        httpstat(step.request.url, {method: step.request.method}).then((result) => {
          //execute consecutively
        });
      });
    } else {
      reject(tv4.error);
    }
  });
};
