export class APIResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  constructor(status: number, message: string, data: T) {
    this.status = status;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
