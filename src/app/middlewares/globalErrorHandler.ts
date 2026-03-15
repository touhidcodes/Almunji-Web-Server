import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.issues[0].message;
  } else if (err.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Unauthorized Access!";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid Token!";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err,
  });
};

export default globalErrorHandler;
