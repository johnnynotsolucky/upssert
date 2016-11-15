import Mustache from 'mustache';

export default (view, model) => {
  let result;
  if (view) {
    try {
      result = Mustache.render(view, model);
    } catch (err) {
      result = false;
    }
  }
  return result;
};
