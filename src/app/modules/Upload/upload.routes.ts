import { Action, Resource, UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { FileUpload } from "../../helpers/fileUpload";
import authAccess from "../../middlewares/authAccess";
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

export const uploadRoutes = router;
