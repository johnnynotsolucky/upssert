import Mustache from 'mustache';

export default (view, model) => {
  if(view) {
    try {
    return Mustache.render(view, model);
    } catch(err) {
      console.log(err);
    }
  }
};
