import httpstat from 'httpstat';
import transposeStatResult from './transposeStatResult';
import renderer from './renderer';
import events from '../data/events.json';

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
    const headers = [];
    if (this.step.request.headers) {
      Object.keys(this.step.request.headers).forEach((key) => {
        const value = this.step.request.headers[key];
        const concatenated = `${key}: ${value}`;
        headers.push(concatenated);
      });
    }
    return headers;
  }

  async makeRequest(form, data, headers) {
    const url = this.step.request.url;
    const method = { method: this.step.request.method };
    const response = await httpstat(url, method, headers, data, form);
    const result = transposeStatResult(response);
    return result;
  }
}

export default HttpRequest;
