import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import { permissionControllers } from "./permission.controller";

const router = express.Router();

/**
 * @swagger
 * /permission:
 *   post:
 *     summary: Create a new permission
 *     description: Create a new permission (only for SUPERADMIN)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resource
 *               - action
 *             properties:
 *               resource:
 *                 type: string
 *                 enum: [SURAH, PARA, AYAH, TAFSIR, DICTIONARY, BOOK, BOOKCATEGORY, BOOKCONTENT, BLOG, DUA, USER, PERMISSION, BOOKMARK]
 *               action:
 *                 type: string
 *                 enum: [READ, CREATE, UPDATE, DELETE]
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Permission already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not SUPERADMIN
 */
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN],
  }),
  permissionControllers.createPermission
);

/**
 * @swagger
 * /permission:
 *   get:
 *     summary: Get all permissions
 *     description: Get all permissions with pagination (ADMIN with PERMISSION.READ permission)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of permissions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.READ,
  }),
  permissionControllers.getAllPermissions
);

/**
 * @swagger
 * /permission/assign:
 *   post:
 *     summary: Assign permission to a user
 *     description: Assign a permission to a user (ADMIN with PERMISSION.CREATE permission)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               permissionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 *       400:
 *         description: Permission already assigned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/assign",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.CREATE,
  }),
  permissionControllers.assignPermissionToUser
);

/**
 * @swagger
 * /permission/bulk-assign:
 *   post:
 *     summary: Bulk assign permissions to a user
 *     description: Assign multiple permissions to a user at once (ADMIN with PERMISSION.CREATE permission)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionIds
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Permissions bulk assigned successfully
 *       400:
 *         description: Some permissions not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/bulk-assign",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.CREATE,
  }),
  permissionControllers.bulkAssignPermissionsToUser
);

/**
 * @swagger
 * /permission/user/{userId}:
 *   get:
 *     summary: Get permissions of a specific user
 *     description: Get all permissions assigned to a user (ADMIN with PERMISSION.READ permission)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of user permissions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/user/:userId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.READ,
  }),
  permissionControllers.getUserPermissions
);

/**
 * @swagger
 * /permission/remove:
 *   delete:
 *     summary: Remove a permission from a user
 *     description: Remove a permission from a user (ADMIN with PERMISSION.DELETE permission)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               permissionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Permission removed successfully
 *       400:
 *         description: Permission not assigned to user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/remove",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.DELETE,
  }),
  permissionControllers.removeUserPermission
);

/**
 * @swagger
 * /permission/{permissionId}:
 *   delete:
 *     summary: Hard delete a permission
 *     description: Hard delete a permission (ADMIN with PERMISSION.DELETE permission)
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission deleted permanently
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
router.delete(
  "/:permissionId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.DELETE,
  }),
  permissionControllers.deletePermission
);

export const permissionRoutes = router;
