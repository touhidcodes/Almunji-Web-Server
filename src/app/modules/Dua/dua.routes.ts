import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { duaControllers } from "./dua.conteoller";
import { duaValidationSchemas } from "./dua.validation";

const router = express.Router();

/**
 * @swagger
 * /dua/:
 *   post:
 *     summary: Create a new Dua
 *     description: Create a new Dua (supplication) with Arabic text, translations, and references. Requires ADMIN or MODERATOR role with CREATE permission for DUA resource.
 *     tags: [Dua]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - arabic
 *               - bangla
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dua before Sleep"
 *               arabic:
 *                 type: string
 *                 example: "اللهم باسمك أموت وأحيا"
 *               transliteration:
 *                 type: string
 *                 example: "Allahumma bismika amoot wa ahyaa"
 *               bangla:
 *                 type: string
 *                 example: "হে আল্লাহ! আপনার নামে আমি মরি এবং বেঁচে থাকি"
 *               english:
 *                 type: string
 *                 example: "O Allah, in Your name I die and live"
 *               reference:
 *                 type: string
 *                 example: "Sunan an-Nasa'i 5432"
 *               tags:
 *                 type: string
 *                 example: "sleep,night,remembrance"
 *     responses:
 *       201:
 *         description: Dua created successfully
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
 *                   example: "Dua created successfully!"
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
    resource: Resource.DUA,
    action: Action.CREATE,
  }),
  validateRequest(duaValidationSchemas.createDuaSchema),
  duaControllers.createDua
);

/**
 * @swagger
 * /dua/all:
 *   get:
 *     summary: Get all Dua (Public)
 *     description: Retrieve all dua without authentication.
 *     tags: [Dua]
 *     responses:
 *       200:
 *         description: Successfully retrieved dua
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
 *                   example: "Dua retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/all", duaControllers.getAllDua);

/**
 * @swagger
 * /dua/admin/all:
 *   get:
 *     summary: Get all Dua by Admins
 *     description: Retrieve all dua with filtering and pagination. Requires ADMIN or MODERATOR role with READ permission for DUA resource.
 *     tags: [Dua]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by dua name
 *     responses:
 *       200:
 *         description: Successfully retrieved dua with pagination
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
 *                   example: "Dua retrieved successfully!"
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
    resource: Resource.DUA,
    action: Action.READ,
  }),
  duaControllers.getAllDuaByAdmin
);

/**
 * @swagger
 * /dua/{duaId}:
 *   get:
 *     summary: Get a specific Dua by ID
 *     description: Retrieve a single dua by its ID. Public endpoint.
 *     tags: [Dua]
 *     parameters:
 *       - in: path
 *         name: duaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dua to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the dua
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
 *                   example: "Dua retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - dua with the given ID does not exist
 */
router.get("/:duaId", duaControllers.getDuaById);

/**
 * @swagger
 * /dua/{duaId}:
 *   put:
 *     summary: Update an existing Dua
 *     description: Update an existing dua. Requires ADMIN or MODERATOR role with UPDATE permission for DUA resource.
 *     tags: [Dua]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: duaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dua to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               arabic:
 *                 type: string
 *               transliteration:
 *                 type: string
 *               bangla:
 *                 type: string
 *               english:
 *                 type: string
 *               reference:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dua updated successfully
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
 *                   example: "Dua updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - dua with the given ID does not exist
 */
router.put(
  "/:duaId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DUA,
    action: Action.UPDATE,
  }),
  validateRequest(duaValidationSchemas.updateDuaSchema),
  duaControllers.updateDua
);

/**
 * @swagger
 * /dua/{duaId}:
 *   delete:
 *     summary: Delete a Dua (Soft Delete)
 *     description: Soft delete a dua (mark as deleted). Requires ADMIN or MODERATOR role with DELETE permission for DUA resource.
 *     tags: [Dua]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: duaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dua to delete
 *     responses:
 *       200:
 *         description: Dua removed successfully
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
 *                   example: "Dua removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - dua with the given ID does not exist
 */
router.delete(
  "/:duaId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DUA,
    action: Action.DELETE,
  }),
  duaControllers.deleteDua
);

/**
 * @swagger
 * /dua/admin/{duaId}:
 *   delete:
 *     summary: Delete a Dua (Hard Delete) - Admin Only
 *     description: Permanently delete a dua from database. Only ADMIN role can perform this operation.
 *     tags: [Dua]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: duaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dua to permanently delete
 *     responses:
 *       200:
 *         description: Dua deleted successfully
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
 *                   example: "Dua deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - dua with the given ID does not exist
 */
router.delete(
  "/admin/:duaId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.DUA,
    action: Action.DELETE,
  }),
  duaControllers.deleteDuaByAdmin
);

export const duaRoutes = router;
