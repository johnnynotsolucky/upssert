
class ErrorContainer extends Error {
  constructor(errors) {
    super();
    this.name = 'ErrorContainer';
    this.message = '';
    this.errors = errors;
  }
}

export default ErrorContainer;