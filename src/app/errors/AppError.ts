export class AppError extends Error {
  public statusCode: number;
  public path?: string;
  constructor(statusCode: number, message: string, path?: string, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
