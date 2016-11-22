import render from '../util/render';

class HttpRequest {
  constructor(request, model) {
    this.model = model;
    this.initialize(request);
  }

  initialize(request) {
    this.url = this.renderUrl(request.url);
    this.method = this.renderRequestMethod(request.method);
    this.form = this.renderFormData(request);
    this.data = this.renderData(request);
    this.headers = this.renderRequestHeaders(request);
  }

  renderUrl(url) {
    let result;
    if (url) {
      result = render(url, this.model);
    }
    return result;
  }

  renderRequestMethod(method) {
    let result;
    if (method) {
      result = render(method, this.model);
    } else {
      return 'GET';
    }
    return result;
  }

  renderFormData(request) {
    let form;
    if (request.form) {
      form = [];
      request.form.forEach((item) => {
        const renderedKey = render(item.key, this.model);
        const renderedValue = render(item.value, this.model);
        const formItem = `${renderedKey}=${renderedValue}`;
        form.push(formItem);
      });
    }
    return form;
  }

  renderData(request) {
    let data;
    if (request.data) {
      data = render(request.data, this.model);
    }
    return data;
  }

  renderRequestHeaders(request) {
    const headers = [];
    if (request.headers) {
      Object.keys(request.headers).forEach((key) => {
        const value = request.headers[key];
        const concatenated = `${key}: ${render(value, this.model)}`;
        headers.push(concatenated);
      });
    }
    return headers;
  }
}

export default HttpRequest;
