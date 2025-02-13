import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { FileUpload } from "../../helpers/fileUpload";
import { uploadController } from "./upload.controller";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/dictionary",
  //   auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  FileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // req.body = UserValidation.createDoctor.parse(JSON.parse(req.body.data));
    return uploadController.uploadDictionaryData(req, res, next);
  }
);

export const uploadRoutes = router;
