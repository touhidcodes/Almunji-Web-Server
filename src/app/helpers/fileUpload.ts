import httpStatus from "http-status";
import multer from "multer";
import APIError from "../errors/APIError";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set unique filename
  },
});

// Filter to accept only JSON files
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "application/json") {
    cb(null, true); // Accept the file
  } else {
    cb(
      new APIError(httpStatus.NOT_ACCEPTABLE, "Only JSON files are allowed"),
      false
    ); // Reject the file
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

export const FileUpload = {
  upload,
};
