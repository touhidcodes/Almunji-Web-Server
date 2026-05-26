import BaseError from "./BaseError";

class AuthorizationError extends BaseError {
  constructor(
    statusCode: number = 403,
    message: string = "Forbidden",
    errorSources: any[] = []
  ) {
    super(statusCode, message, errorSources);
  }
}

export default AuthorizationError;
