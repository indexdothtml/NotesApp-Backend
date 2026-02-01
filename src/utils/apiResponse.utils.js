class APIResponse {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default APIResponse;
