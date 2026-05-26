import httpStatus from "http-status";
import multer from "multer";
import APIError from "@/errors/APIError";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter to accept only JSON files
const jsonFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "application/json") {
    cb(null, true);
  } else {
    cb(
      new APIError(
        httpStatus.UNSUPPORTED_MEDIA_TYPE,
        "Only JSON files are allowed"
      ),
      false
    );
  }
};

// Filter to accept only CSV files
const csvFileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.originalname.endsWith(".csv")
  ) {
    cb(null, true);
  } else {
    cb(
      new APIError(
        httpStatus.UNSUPPORTED_MEDIA_TYPE,
        "Only CSV files are allowed"
      ),
      false
    );
  }
};

// Multer instance for JSON uploads (dictionary)
const jsonUpload = multer({
  storage,
  fileFilter: jsonFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Multer instance for CSV uploads (surahs, etc.)
const csvUpload = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const FileUpload = {
  upload: jsonUpload, // kept for backward compatibility (dictionary JSON upload)
  csvUpload,
};
