import { Prisma } from "@/generated/prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import AuthorizationError from "./AuthorizationError";
import config from "@/config/config";
import logger from "@/utils/logger";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorSources: any[] = [];

  // Log the error
  // console.error(err);

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    }));
  } else if (err?.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = err.errorSources || [];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate Resource";
      errorSources = [
        {
          path: "",
          message: `${err.meta?.target} already exists`,
        },
      ];
    } else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "Resource not found";
      errorSources = [
        {
          path: "",
          message: (err.meta?.cause as string) || "Record to update not found.",
        },
      ];
    }
  } else if (err.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token Expired!";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid Token!";
  }

  // Response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
