import express, { NextFunction, Request, Response } from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import { FileUpload } from "@/helpers/fileUpload";
import authAccess from "@/middlewares/authAccess";
import { uploadController } from "./upload.controller";

const router = express.Router();

/**
 * @swagger
 * /upload/dictionary:
 *   post:
 *     summary: Bulk upload Dictionary Words from JSON file
 *     description: Upload multiple dictionary words from a JSON file. Requires SUPERADMIN or ADMIN role with CREATE permission for DICTIONARY resource.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JSON file containing dictionary words
 *     responses:
 *       200:
 *         description: Dictionary JSON uploaded and processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dictionary JSON uploaded and processed successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadedCount:
 *                       type: integer
 *                     failedCount:
 *                       type: integer
 *       400:
 *         description: Bad request - no file uploaded or invalid JSON format
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       413:
 *         description: Payload too large - file size exceeds limit
 */
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

/**
 * @swagger
 * /upload/ayahs:
 *   post:
 *     summary: Bulk upload Ayahs from JSON file
 *     description: Upload multiple ayahs from a JSON file. Requires SUPERADMIN or ADMIN role with CREATE permission for AYAH resource.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JSON file containing ayahs
 *     responses:
 *       200:
 *         description: Ayah JSON uploaded and processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ayah JSON uploaded and processed successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadedCount:
 *                       type: integer
 *                     failedCount:
 *                       type: integer
 *       400:
 *         description: Bad request - no file uploaded or invalid JSON format
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       413:
 *         description: Payload too large - file size exceeds limit
 */
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
