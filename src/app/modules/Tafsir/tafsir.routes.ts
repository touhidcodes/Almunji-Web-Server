import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { tafsirControllers } from "./tafsir.controller";
import { tafsirValidationSchema } from "./tafsir.validation";

const router = express.Router();

/**
 * @swagger
 * /tafsir/:
 *   post:
 *     summary: Create a new Tafsir
 *     description: Create a new Tafsir (exegesis) for a specific Ayah. Requires ADMIN or MODERATOR role with CREATE permission for TAFSIR resource.
 *     tags: [Tafsir]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ayahId
 *             properties:
 *               ayahId:
 *                 type: string
 *                 example: "60b3f7e8e4b0a7d5f8c9d1e4"
 *               heading:
 *                 type: string
 *                 example: "Introduction"
 *               summaryBn:
 *                 type: string
 *                 example: "বিস্তারিত ব্যাখ্যা"
 *               summaryEn:
 *                 type: string
 *                 example: "Detailed explanation"
 *               detailBn:
 *                 type: string
 *                 example: "আল্লাহর নামে শুরু..."
 *               detailEn:
 *                 type: string
 *                 example: "In the name of Allah..."
 *               scholar:
 *                 type: string
 *                 example: "Ibn Kathir"
 *               reference:
 *                 type: string
 *                 example: "Tafsir Ibn Kathir"
 *               tags:
 *                 type: string
 *                 example: "tafsir,exegesis,coran"
 *     responses:
 *       200:
 *         description: Tafsir created successfully
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
 *                   example: "Tafsir created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.CREATE,
  }),
  validateRequest(tafsirValidationSchema.createTafsirSchema),
  tafsirControllers.createTafsir
);

/**
 * @swagger
 * /tafsir/admin/all:
 *   get:
 *     summary: Get all Tafsir by Admins
 *     description: Retrieve all Tafsir with filtering and pagination. Requires ADMIN or MODERATOR role with READ permission for TAFSIR resource.
 *     tags: [Tafsir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: ayahId
 *         schema:
 *           type: string
 *         description: Filter by Ayah ID
 *       - in: query
 *         name: scholar
 *         schema:
 *           type: string
 *         description: Filter by scholar name
 *     responses:
 *       200:
 *         description: Successfully retrieved Tafsir with pagination
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
 *                   example: "Tafsir retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.READ,
  }),
  tafsirControllers.getAllTafsirByAdmin
);

/**
 * @swagger
 * /tafsir/ayah/{ayahId}:
 *   get:
 *     summary: Get Tafsir by Ayah ID
 *     description: Retrieve all Tafsir for a specific Ayah. Public endpoint.
 *     tags: [Tafsir]
 *     parameters:
 *       - in: path
 *         name: ayahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Ayah
 *     responses:
 *       200:
 *         description: Successfully retrieved Tafsir for the Ayah
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
 *                   example: "Tafsir retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/ayah/:ayahId", tafsirControllers.getTafsirByAyah);

/**
 * @swagger
 * /tafsir/{tafsirId}:
 *   get:
 *     summary: Get a specific Tafsir by ID
 *     description: Retrieve a single Tafsir by its ID. Public endpoint.
 *     tags: [Tafsir]
 *     parameters:
 *       - in: path
 *         name: tafsirId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Tafsir to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the Tafsir
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
 *                   example: "Tafsir retrieved successfully"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - Tafsir with the given ID does not exist
 */
router.get("/:tafsirId", tafsirControllers.getTafsirById);

/**
 * @swagger
 * /tafsir/{tafsirId}:
 *   put:
 *     summary: Update an existing Tafsir
 *     description: Update an existing Tafsir. Requires ADMIN or MODERATOR role with UPDATE permission for TAFSIR resource.
 *     tags: [Tafsir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tafsirId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Tafsir to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heading:
 *                 type: string
 *               summaryBn:
 *                 type: string
 *               summaryEn:
 *                 type: string
 *               detailBn:
 *                 type: string
 *               detailEn:
 *                 type: string
 *               scholar:
 *                 type: string
 *               reference:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tafsir updated successfully
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
 *                   example: "Tafsir updated successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Tafsir with the given ID does not exist
 */
router.put(
  "/:tafsirId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.UPDATE,
  }),
  validateRequest(tafsirValidationSchema.updateTafsirSchema),
  tafsirControllers.updateTafsir
);

/**
 * @swagger
 * /tafsir/{tafsirId}:
 *   delete:
 *     summary: Delete a Tafsir (Soft Delete)
 *     description: Soft delete a Tafsir (mark as deleted). Requires ADMIN or MODERATOR role with DELETE permission for TAFSIR resource.
 *     tags: [Tafsir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tafsirId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Tafsir to delete
 *     responses:
 *       200:
 *         description: Tafsir removed successfully
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
 *                   example: "Tafsir removed successfully"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Tafsir with the given ID does not exist
 */
router.delete(
  "/:tafsirId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.DELETE,
  }),
  tafsirControllers.deleteTafsir
);

/**
 * @swagger
 * /tafsir/admin/{tafsirId}:
 *   delete:
 *     summary: Delete a Tafsir (Hard Delete) - Admin Only
 *     description: Permanently delete a Tafsir from database. Only ADMIN role can perform this operation.
 *     tags: [Tafsir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tafsirId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Tafsir to permanently delete
 *     responses:
 *       200:
 *         description: Tafsir deleted successfully
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
 *                   example: "Tafsir deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Tafsir with the given ID does not exist
 */
router.delete(
  "/admin/:tafsirId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.TAFSIR,
    action: Action.DELETE,
  }),
  tafsirControllers.deleteTafsirByAdmin
);

export const tafsirRoutes = router;
