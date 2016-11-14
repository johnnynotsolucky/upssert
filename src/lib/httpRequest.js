import httpstat from 'httpstat';
import transposeStatResult from './transposeStatResult';

class HttpRequest {
  constructor(step, resultset) {
    this.step = step;
    this.resultset = resultset;
  }

  async execute() {
    try {
      const result = await httpstat(this.step.request.url, {
          method: this.step.request.method
        });
      //TODO use mustache templating and add post data, etc
      const object = transposeStatResult(result);
      return object;
    } catch (err) {
      this.emit(events.SUITE_STEP_FAIL, this.step, err);
      return false;
    }
  }
}

export default HttpRequest;
