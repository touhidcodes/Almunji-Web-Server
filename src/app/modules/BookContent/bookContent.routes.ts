import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { bookContentControllers } from "./bookContent.controller";
import { bookContentValidationSchema } from "./bookContent.validation";

const router = express.Router();

/**
 * @swagger
 * /book-content/:
 *   post:
 *     summary: Create a new Book Content
 *     description: Create a new content section for a book. Requires SUPERADMIN, ADMIN, or MODERATOR role with CREATE permission for BOOKCONTENT resource.
 *     tags: [BookContent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - section
 *               - index
 *               - text
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "60b3f7e8e4b0a7d5f8c9d1e6"
 *               section:
 *                 type: string
 *                 example: "Introduction"
 *               index:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               text:
 *                 type: string
 *                 example: "This is the content text..."
 *     responses:
 *       200:
 *         description: Book content added successfully
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
 *                   example: "Book content added successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error or text too long
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.CREATE,
  }),
  validateRequest(bookContentValidationSchema.createContentSchema),
  bookContentControllers.createBookContent
);

/**
 * @swagger
 * /book-content/admin/all:
 *   get:
 *     summary: Get all Book Contents by Admins
 *     description: Retrieve all book contents with filtering and pagination. Requires SUPERADMIN, ADMIN, or MODERATOR role with READ permission for BOOKCONTENT resource.
 *     tags: [BookContent]
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
 *         name: bookId
 *         schema:
 *           type: string
 *         description: Filter by book ID
 *     responses:
 *       200:
 *         description: Successfully retrieved book contents with pagination
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
 *                   example: "Book contents retrieved successfully!"
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
  "/admin/all",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.READ,
  }),
  bookContentControllers.getAllBookContentByAdmin
);

/**
 * @swagger
 * /book-content/{contentId}:
 *   get:
 *     summary: Get a specific Book Content by ID
 *     description: Retrieve a single book content by its ID. Public endpoint.
 *     tags: [BookContent]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the book content
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
 *                   example: "Book content retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - book content with the given ID does not exist
 */
router.get("/:contentId", bookContentControllers.getBookContentById);

/**
 * @swagger
 * /book-content/book/{bookId}:
 *   get:
 *     summary: Get all Book Contents by Book ID
 *     description: Retrieve all content sections for a specific book. Public endpoint.
 *     tags: [BookContent]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: Successfully retrieved book contents
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
 *                   example: "Book content retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/book/:bookId", bookContentControllers.getContentsByBookId);

/**
 * @swagger
 * /book-content/index/{bookId}:
 *   get:
 *     summary: Get Book Index by Book ID
 *     description: Retrieve the index/content structure for a specific book. Public endpoint.
 *     tags: [BookContent]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: Successfully retrieved book index
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
 *                   example: "Book index retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/index/:bookId", bookContentControllers.getBookIndexByBookId);

/**
 * @swagger
 * /book-content/{contentId}:
 *   put:
 *     summary: Update a specific Book Content
 *     description: Update an existing book content section. Requires SUPERADMIN, ADMIN, or MODERATOR role with UPDATE permission for BOOKCONTENT resource.
 *     tags: [BookContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book content to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               section:
 *                 type: string
 *                 minLength: 1
 *               index:
 *                 type: integer
 *                 minimum: 1
 *               text:
 *                 type: string
 *                 maxLength: 65535
 *               isDeleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Book content updated successfully
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
 *                   example: "Book content updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error or text too long
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - book content with the given ID does not exist
 */
router.put(
  "/:contentId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.UPDATE,
  }),
  validateRequest(bookContentValidationSchema.updateContentSchema),
  bookContentControllers.updateBookContent
);

/**
 * @swagger
 * /book-content/{contentId}:
 *   delete:
 *     summary: Delete a Book Content (Soft Delete)
 *     description: Soft delete a book content section (mark as deleted). Requires SUPERADMIN, ADMIN, or MODERATOR role with DELETE permission for BOOKCONTENT resource.
 *     tags: [BookContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book content to delete
 *     responses:
 *       200:
 *         description: Book content removed successfully
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
 *                   example: "Book content removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - book content with the given ID does not exist
 */
router.delete(
  "/:contentId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.DELETE,
  }),
  bookContentControllers.deleteBookContent
);

/**
 * @swagger
 * /book-content/admin/{contentId}:
 *   delete:
 *     summary: Delete a Book Content (Hard Delete) - Admin Only
 *     description: Permanently delete a book content from database. Only SUPERADMIN and ADMIN roles can perform this operation.
 *     tags: [BookContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book content to permanently delete
 *     responses:
 *       200:
 *         description: Book content deleted successfully
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
 *                   example: "Book content deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - book content with the given ID does not exist
 */
router.delete(
  "/admin/:contentId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.BOOKCONTENT,
    action: Action.DELETE,
  }),
  bookContentControllers.deleteBookContentByAdmin
);

export const bookContentRoutes = router;
