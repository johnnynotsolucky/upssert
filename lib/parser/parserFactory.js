const contentTypes = require('../../data/content-types.json');

module.exports = (contentType) => {
  switch(contentType) {
    case contentTypes.JSON:
      return require('./jsonParser');
    default:
      return { parse: (data) => data };
  }
};