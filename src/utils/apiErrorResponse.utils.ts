export class APIErrorResponse extends Error {
  status: number;
  success: boolean;
  errorMessage: string;

  constructor(status = 500, message = "Something went wrong.") {
    super(message);
    this.status = status;
    this.success = false;
    this.errorMessage = message;
  }
}
