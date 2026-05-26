import fs from "fs";
import { parse } from "csv-parse/sync";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "@/utils/catchAsync";
import APIError from "@/errors/APIError";
import sendResponse from "@/utils/sendResponse";
import { IUploadFile } from "@/interfaces/file";
import { uploadServices } from "./upload.service";

// Upload dictionary words controller
const uploadDictionaryData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new APIError(httpStatus.BAD_REQUEST, "No file uploaded");
    }
    const file = req.file as IUploadFile;

    try {
      const fileContent = fs.readFileSync(file.path, "utf-8");
      const jsonData = JSON.parse(fileContent);

      const result = await uploadServices.uploadWordsFromFiles(jsonData);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dictionary JSON uploaded and processed successfully!",
        data: result,
      });
    } catch (error) {
      return next(error);
    } finally {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }
  }
);

// Upload ayahs controller
const uploadAyahData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new APIError(httpStatus.BAD_REQUEST, "No file uploaded");
    }

    const file = req.file as IUploadFile;

    try {
      const fileContent = fs.readFileSync(file.path, "utf-8");
      const jsonData = JSON.parse(fileContent);

      const result = await uploadServices.uploadAyahsFromFiles(jsonData);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Ayah JSON uploaded and processed successfully!",
        data: result,
      });
    } catch (error) {
      return next(error);
    } finally {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }
  }
);

export const uploadController = {
  uploadDictionaryData,
  uploadAyahData,
};
