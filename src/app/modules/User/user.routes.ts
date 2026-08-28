import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { userValidationSchema } from "./user.validation";

const router = express.Router();

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get the current logged-in user
 *     description: Retrieve the profile of the currently logged-in user. Requires ADMIN, MODERATOR, or USER role.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: "User profile retrieved successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [SUPERADMIN, ADMIN, MODERATOR, USER]
 *                     image:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     profession:
 *                       type: string
 *                     address:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  }),
  userControllers.getUser
);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get the current logged-in user's profile
 *     description: Retrieve the detailed profile of the currently logged-in user. Requires ADMIN, MODERATOR, or USER role.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: "User profile retrieved successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/profile",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  }),
  userControllers.getUserProfile
);

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users (Admin Only)
 *     description: Retrieve all users in the system. Only ADMIN role can access this endpoint.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users profile retrieved successfully
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
 *                   example: "All users profile retrieved successfully!"
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
  "/all",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.USER,
    action: Action.READ,
  }),
  userControllers.getAllUser
);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the profile of the currently logged-in user. Requires ADMIN, MODERATOR, or USER role.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: uri
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               profession:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, BLOCKED]
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: "User profile updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.put(
  "/profile",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  }),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserProfile
);

/**
 * @swagger
 * /user/status/{userId}:
 *   put:
 *     summary: Update user status (Admin Only)
 *     description: Update the status of a user. Only ADMIN role can access this endpoint.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, BLOCKED]
 *     responses:
 *       200:
 *         description: User status updated successfully
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
 *                   example: "User status updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - user with the given ID does not exist
 */
router.put(
  "/status/:userId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.USER,
    action: Action.UPDATE,
  }),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserStatus
);

export const userRoutes = router;
