import httpstat from 'httpstat';
import transposeStatResult from './transposeStatResult';
import renderer from './renderer';

class HttpRequest {
  constructor(step, resultset) {
    this.step = step;
    this.resultset = resultset;
  }

  async execute() {
    try {
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
      const data = renderer(this.step.request.data, this.resultset);

      let headers;
      if (this.step.request.headers) {
        headers = [];
        for(const key in this.step.request.headers) {
          const value = this.step.request.headers[key];
          const concatenated = `${key}: ${value}`;
          headers.push(concatenated);
        }
      }
      const result = await httpstat(this.step.request.url, {
          method: this.step.request.method
        },
        headers,
        data,
        form);
      const object = transposeStatResult(result);
      return object;
    } catch (err) {
      this.emit(events.SUITE_STEP_FAIL, this.step, err);
      return false;
    }
  }
}

export default HttpRequest;
