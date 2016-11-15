import httpstat from 'httpstat';
import transposeStatResult from './transposeStatResult';
import renderer from './renderer';

class HttpRequest {
  constructor(step, resultset) {
    this.step = step;
    this.resultset = resultset;
  }

  async execute() {
    let result;
    try {
      const form = this.formatFormData();
      const data = this.formatData();
      const headers = this.formatRequestHeaders();
      const response = await this.makeRequest(form, data, headers);
      result = response;
    } catch (err) {
      this.emit(events.SUITE_STEP_FAIL, this.step, err);
      result = false;
    }
    return result;
  }

  formatFormData() {
    let form;
    if (this.step.request.form) {
      form = [];
      this.step.request.form.forEach((item) => {
        const renderedKey = renderer(item.key, this.resultset);
        const renderedValue = renderer(item.value, this.resultset);
        const formItem = `${renderedKey}=${renderedValue}`;
        form.push(formItem);
      });
    }
    return form;
  }

  formatData() {
    return renderer(this.step.request.data, this.resultset);
  }

  formatRequestHeaders() {
    let headers = [];
    if (this.step.request.headers) {
      for(const key in this.step.request.headers) {
        const value = this.step.request.headers[key];
        const concatenated = `${key}: ${value}`;
        headers.push(concatenated);
      }
    }
    return headers;
  }

  async makeRequest(form, data, headers) {
    const response = await httpstat(this.step.request.url, {
        method: this.step.request.method
      },
      headers,
      data,
      form);
    const result = transposeStatResult(response);
    return result;
  }
}

export default HttpRequest;
