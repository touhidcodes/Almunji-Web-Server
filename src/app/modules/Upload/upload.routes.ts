import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { FileUpload } from "../../helpers/fileUpload";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/dictionary",
  //   auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  FileUpload.upload.single("file")
);

export const uploadRoutes = router;
