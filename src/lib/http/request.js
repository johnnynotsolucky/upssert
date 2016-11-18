import render from '../util/render';

class HttpRequest {
  constructor(step, model) {
    this.model = model;
    this.initialize(step);
  }

  initialize(step) {
    this.url = step.request.url;
    this.method = { method: step.request.method || 'GET' };
    this.form = this.renderFormData(step);
    this.data = this.renderData(step);
    this.headers = this.renderRequestHeaders(step);
  }

  renderFormData(step) {
    let form;
    if (step.request.form) {
      form = [];
      step.request.form.forEach((item) => {
        const renderedKey = render(item.key, this.model);
        const renderedValue = render(item.value, this.model);
        const formItem = `${renderedKey}=${renderedValue}`;
        form.push(formItem);
      });
    }
    return form;
  }

  renderData(step) {
    let data;
    if (step.request.data) {
      data = render(step.request.data, this.model);
    }
    return data;
  }

  renderRequestHeaders(step) {
    const headers = [];
    if (step.request.headers) {
      Object.keys(step.request.headers).forEach((key) => {
        const value = step.request.headers[key];
        const concatenated = `${key}: ${render(value, this.model)}`;
        headers.push(concatenated);
      });
    }
    return headers;
  }
}

export default HttpRequest;
