class BaseError extends Error {
  statusCode: number;
  errorSources: any[];
  isOperational: boolean;

  constructor(statusCode: number, message: string, errorSources: any[] = []) {
    super(message);

    this.statusCode = statusCode;
    this.errorSources = errorSources;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
