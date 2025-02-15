import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import APIError from "../../errors/APIError";
import sendResponse from "../../utils/sendResponse";
import { IUploadFile } from "../../interfaces/file";
import fs from "fs";

const uploadDictionaryData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new APIError(httpStatus.BAD_REQUEST, "No file uploaded");
    }
    const file = req.file as IUploadFile;

    // Parse JSON data from uploaded file
    const fileContent = fs.readFileSync(file.path, "utf-8"); // Use "utf-8" encoding to get a string
    const jsonData = JSON.parse(fileContent);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "JSON file uploaded and processed successfully",
      // data: result,
      data: jsonData,
    });
  }
);

export const uploadController = {
  uploadDictionaryData,
};
