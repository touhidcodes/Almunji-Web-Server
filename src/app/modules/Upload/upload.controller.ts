import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import APIError from "../../errors/APIError";
import sendResponse from "../../utils/sendResponse";
import { IUploadFile } from "../../interfaces/file";
import fs from "fs";
import { uploadServices } from "./upload.service";

const uploadDictionaryData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new APIError(httpStatus.BAD_REQUEST, "No file uploaded");
    }
    const file = req.file as IUploadFile;

    try {
      // Parse JSON data from uploaded file
      const fileContent = fs.readFileSync(file.path, "utf-8");
      const jsonData = JSON.parse(fileContent);

      const result = await uploadServices.uploadWordsFromFiles(jsonData);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "JSON file uploaded and processed successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    } finally {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
  }
);

export const uploadController = {
  uploadDictionaryData,
};
