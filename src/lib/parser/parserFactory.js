import contentTypes from '../../data/content-types.json';

export default (contentType) => {
  switch(contentType) {
    case contentTypes.JSON:
      return require('./jsonParser');
    default:
      return { parse: (data) => data };
  }
};