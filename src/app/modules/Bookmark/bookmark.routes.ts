import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { bookmarkControllers } from "./bookmark.controller";
import { bookmarkValidationSchema } from "./bookmark.validation";

const router = express.Router();

/**
 * @swagger
 * /bookmark/:
 *   post:
 *     summary: Create a new Bookmark
 *     description: Create a bookmark for a DUA or AYAH. Requires ADMIN, MODERATOR, or USER role with CREATE permission for BOOKMARK resource.
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - itemType
 *             properties:
 *               itemId:
 *                 type: string
 *                 example: "60b3f7e8e4b0a7d5f8c9d1e7"
 *               itemType:
 *                 type: string
 *                 enum: [DUA, AYAH]
 *                 example: "AYAH"
 *     responses:
 *       201:
 *         description: Bookmark created successfully
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
 *                   example: "Bookmark created successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error or item already bookmarked
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.CREATE,
  }),
  validateRequest(bookmarkValidationSchema.createBookmarkSchema),
  bookmarkControllers.createBookmark
);

/**
 * @swagger
 * /bookmark/me:
 *   get:
 *     summary: Get all Bookmarks of logged-in user
 *     description: Retrieve all bookmarks of the currently logged-in user. Requires ADMIN, MODERATOR, or USER role.
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bookmarks
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
 *                   example: "Bookmarks retrieved successfully!"
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
  "/me",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.READ,
  }),
  bookmarkControllers.getMyBookmarks
);

/**
 * @swagger
 * /bookmark/{bookmarkId}:
 *   get:
 *     summary: Get a single Bookmark of logged-in user
 *     description: Retrieve a single bookmark by ID. Requires ADMIN, MODERATOR, or USER role with READ permission for BOOKMARK resource.
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bookmark to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the bookmark
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
 *                   example: "Bookmark retrieved successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - bookmark with the given ID does not exist
 */
router.get(
  "/:bookmarkId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.READ,
  }),
  bookmarkControllers.getSingleBookmark
);

/**
 * @swagger
 * /bookmark/{bookmarkId}:
 *   delete:
 *     summary: Delete a Bookmark by user
 *     description: Delete a bookmark. Requires ADMIN, MODERATOR, or USER role with DELETE permission for BOOKMARK resource.
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bookmark to delete
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
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
 *                   example: "Bookmark removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - bookmark with the given ID does not exist
 */
router.delete(
  "/:bookmarkId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.DELETE,
  }),
  bookmarkControllers.deleteBookmark
);

/**
 * @swagger
 * /bookmark/:
 *   get:
 *     summary: Get all Bookmarks (Admin Only)
 *     description: Retrieve all bookmarks from all users. Only ADMIN role can access this endpoint.
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all bookmarks
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
 *                   example: "All bookmarks retrieved successfully!"
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
  "/",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.BOOKMARK,
    action: Action.READ,
  }),
  bookmarkControllers.getAllBookmarksByAdmin
);

/**
 * @swagger
 * /bookmark/admin/{bookmarkId}:
 *   delete:
 *     summary: Delete a Bookmark (Hard Delete) - Admin Only
 *     description: Permanently delete a bookmark from database. Only ADMIN role can perform this operation.
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bookmark to permanently delete
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
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
 *                   example: "Bookmark deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - bookmark with the given ID does not exist
 */
router.delete(
  "/admin/:bookmarkId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.BOOKMARK,
    action: Action.DELETE,
  }),
  bookmarkControllers.deleteBookmarkByAdmin
);

export const bookmarkRoutes = router;
