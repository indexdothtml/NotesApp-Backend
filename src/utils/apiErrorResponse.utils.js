class APIErrorResponse extends Error {
  constructor(status = 500, message = "Something went wrong.") {
    super(message);
    this.status = status;
    this.errorMessage = message;
  }
}

export default APIErrorResponse;
