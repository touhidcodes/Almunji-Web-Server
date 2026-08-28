import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { surahControllers } from "./surah.controller";
import { surahValidationSchema } from "./surah.validation";

const router = express.Router();

/**
 * @swagger
 * /surah:
 *   post:
 *     summary: Create a new Surah
 *     description: Create a new Surah (SUPERADMIN, ADMIN, MODERATOR with SURAH.CREATE permission)
 *     tags: [Surah]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chapter
 *               - totalAyah
 *               - arabic
 *               - english
 *               - revelation
 *             properties:
 *               chapter:
 *                 type: integer
 *               totalAyah:
 *                 type: integer
 *               arabic:
 *                 type: string
 *               english:
 *                 type: string
 *               bangla:
 *                 type: string
 *               history:
 *                 type: string
 *               revelation:
 *                 type: string
 *                 enum: [MECCAN, MEDINAN]
 *     responses:
 *       201:
 *         description: Surah created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.SURAH,
    action: Action.CREATE,
  }),
  validateRequest(surahValidationSchema.createSurahSchema),
  surahControllers.createSurah
);

/**
 * @swagger
 * /surah/all:
 *   get:
 *     summary: Get all Surahs (public)
 *     description: Get all Surahs without authentication
 *     tags: [Surah]
 *     responses:
 *       200:
 *         description: List of all Surahs
 */
router.get("/all", surahControllers.getAllSurahs);

/**
 * @swagger
 * /surah/admin/all:
 *   get:
 *     summary: Get all Surahs (Admin/Moderator)
 *     description: Get all Surahs with pagination (SUPERADMIN, ADMIN, MODERATOR with SURAH.READ permission)
 *     tags: [Surah]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all Surahs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.SURAH,
    action: Action.READ,
  }),
  surahControllers.getAllSurahsByAdmin
);

/**
 * @swagger
 * /surah/{surahId}:
 *   get:
 *     summary: Get a specific Surah by ID
 *     description: Get a specific Surah by ID without authentication
 *     tags: [Surah]
 *     parameters:
 *       - in: path
 *         name: surahId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Surah details
 *       404:
 *         description: Surah not found
 */
router.get("/:surahId", surahControllers.getSurahById);

/**
 * @swagger
 * /surah/{surahId}:
 *   put:
 *     summary: Update a Surah by ID
 *     description: Update an existing Surah (SUPERADMIN, ADMIN, MODERATOR with SURAH.UPDATE permission)
 *     tags: [Surah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: surahId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapter:
 *                 type: integer
 *               totalAyah:
 *                 type: integer
 *               arabic:
 *                 type: string
 *               english:
 *                 type: string
 *               bangla:
 *                 type: string
 *               history:
 *                 type: string
 *               revelation:
 *                 type: string
 *                 enum: [MECCAN, MEDINAN]
 *     responses:
 *       200:
 *         description: Surah updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  "/:surahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.SURAH,
    action: Action.UPDATE,
  }),
  validateRequest(surahValidationSchema.updateSurahSchema),
  surahControllers.updateSurah
);

/**
 * @swagger
 * /surah/admin/{surahId}:
 *   delete:
 *     summary: Delete a Surah by ID
 *     description: Delete a Surah (SUPERADMIN, ADMIN with SURAH.DELETE permission)
 *     tags: [Surah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: surahId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Surah deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/admin/:surahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.SURAH,
    action: Action.DELETE,
  }),
  surahControllers.deleteSurah
);

export const surahRoutes = router;
