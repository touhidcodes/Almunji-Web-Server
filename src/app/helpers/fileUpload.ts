import httpStatus from "http-status";
import multer from "multer";
import APIError from "../errors/APIError";
import { NextFunction } from "express";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set unique filename
  },
});

// Filter to accept only JSON files
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "application/json") {
    cb(null, true); // Accept the file
  } else {
    cb(
      new APIError(
        httpStatus.UNSUPPORTED_MEDIA_TYPE,
        "Only JSON files are allowed"
      ),
      false
    ); // Reject the file
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
});

export const FileUpload = {
  upload,
};
