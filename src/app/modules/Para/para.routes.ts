import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { paraControllers } from "./para.controller";
import { paraValidationSchema } from "./para.validation";

const router = express.Router();

/**
 * @swagger
 * /para/:
 *   post:
 *     summary: Create a new Para
 *     description: Create a new Para (Juz) with number, Arabic name, and Ayah references. Requires SUPERADMIN, ADMIN, or MODERATOR role with CREATE permission for PARA resource.
 *     tags: [Para]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - arabic
 *               - startAyahRef
 *               - endAyahRef
 *             properties:
 *               number:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *                 example: 1
 *               arabic:
 *                 type: string
 *                 example: "الفاتحة"
 *               english:
 *                 type: string
 *                 example: "The Opening"
 *               bangla:
 *                 type: string
 *                 example: "ফাতিহা"
 *               startAyahRef:
 *                 type: string
 *                 example: "1:1"
 *               endAyahRef:
 *                 type: string
 *                 example: "1:7"
 *     responses:
 *       200:
 *         description: Para created successfully
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
 *                   example: "Para created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     number:
 *                       type: integer
 *                     arabic:
 *                       type: string
 *                     english:
 *                       type: string
 *                     bangla:
 *                       type: string
 *                     startAyahRef:
 *                       type: string
 *                     endAyahRef:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - validation error or missing required fields
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       409:
 *         description: Conflict - Para already exists
 */
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.PARA,
    action: Action.CREATE,
  }),
  validateRequest(paraValidationSchema.createParaSchema),
  paraControllers.createPara
);

/**
 * @swagger
 * /para/:
 *   get:
 *     summary: Get all Paras (Public)
 *     description: Retrieve all Paras without authentication. Useful for public-facing applications.
 *     tags: [Para]
 *     responses:
 *       200:
 *         description: Successfully retrieved all Paras
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
 *                   example: "Paras retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       number:
 *                         type: integer
 *                       arabic:
 *                         type: string
 *                       english:
 *                         type: string
 *                       bangla:
 *                         type: string
 *                       startAyahRef:
 *                         type: string
 *                       endAyahRef:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", paraControllers.getAllParas);

/**
 * @swagger
 * /para/admin:
 *   get:
 *     summary: Get all Paras (Admin)
 *     description: Retrieve all Paras with filtering and pagination. Requires SUPERADMIN, ADMIN, or MODERATOR role with READ permission for PARA resource.
 *     tags: [Para]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., "number:asc" or "number:desc")
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering
 *     responses:
 *       200:
 *         description: Successfully retrieved Paras with pagination metadata
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
 *                   example: "Paras retrieved successfully!"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
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
  "/admin",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.PARA,
    action: Action.READ,
  }),
  paraControllers.getAllParasByAdmin
);

/**
 * @swagger
 * /para/{paraId}:
 *   get:
 *     summary: Get a specific Para by ID
 *     description: Retrieve a single Para by its ID. No authentication required.
 *     tags: [Para]
 *     parameters:
 *       - in: path
 *         name: paraId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Para to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the Para
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
 *                   example: "Para retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - Para with the given ID does not exist
 */
router.get("/:paraId", paraControllers.getParaById);

/**
 * @swagger
 * /para/{paraId}:
 *   put:
 *     summary: Update a specific Para
 *     description: Update an existing Para. Requires SUPERADMIN, ADMIN, or MODERATOR role with UPDATE permission for PARA resource.
 *     tags: [Para]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paraId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Para to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 30
 *               arabic:
 *                 type: string
 *               english:
 *                 type: string
 *               bangla:
 *                 type: string
 *               startAyahRef:
 *                 type: string
 *               endAyahRef:
 *                 type: string
 *     responses:
 *       200:
 *         description: Para updated successfully
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
 *                   example: "Para updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Para with the given ID does not exist
 */
router.put(
  "/:paraId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.PARA,
    action: Action.UPDATE,
  }),
  validateRequest(paraValidationSchema.updateParaSchema),
  paraControllers.updatePara
);

/**
 * @swagger
 * /para/{paraId}:
 *   delete:
 *     summary: Delete a specific Para (Soft Delete)
 *     description: Soft delete a Para (mark as deleted). Requires SUPERADMIN, ADMIN, or MODERATOR role with DELETE permission for PARA resource.
 *     tags: [Para]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paraId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Para to delete
 *     responses:
 *       200:
 *         description: Para deleted successfully
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
 *                   example: "Para deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Para with the given ID does not exist
 */
router.delete(
  "/:paraId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.PARA,
    action: Action.DELETE,
  }),
  paraControllers.deletePara
);

export const paraRoutes = router;
