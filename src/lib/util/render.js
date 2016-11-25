import Mustache from 'mustache';

export default (view, model, unescape) => {
  let rendered = Mustache.render(view, model);
  if (unescape) {
    const escaped = rendered.match(/&#x[a-fA-F0-9][a-fA-F0-9];/g);
    if (escaped) {
      const hexes = escaped.map(m => m.replace(/&#/, '0').replace(/;/, ''));
      escaped.forEach((match, index) => {
        rendered = rendered.replace(match, String.fromCharCode(parseInt(hexes[index], 16)));
      });
    }
  }
  return rendered;
};
