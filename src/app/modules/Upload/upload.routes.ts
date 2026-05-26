import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import express, { NextFunction, Request, Response } from "express";
import { FileUpload } from "@/helpers/fileUpload";
import authAccess from "@/middlewares/authAccess";
import { uploadController } from "./upload.controller";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/dictionary",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.DICTIONARY,
    action: Action.CREATE,
  }),
  FileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    return uploadController.uploadDictionaryData(req, res, next);
  }
);

// Route to create ayahs for a surah
router.post(
  "/ayahs",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.AYAH,
    action: Action.CREATE,
  }),
  FileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    return uploadController.uploadAyahData(req, res, next);
  }
);

export const uploadRoutes = router;
