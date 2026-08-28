import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { bookControllers } from "./book.controller";
import { bookValidationSchema } from "./book.validation";

const router = express.Router();

/**
 * @swagger
 * /book/:
 *   post:
 *     summary: Create a new Book
 *     description: Create a new book with name, description, cover, and category. Requires ADMIN or MODERATOR role with CREATE permission for BOOK resource.
 *     tags: [Book]
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
 *               - cover
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tafsir Ibn Kathir"
 *               description:
 *                 type: string
 *                 example: "A comprehensive tafsir of the Quran by Ibn Kathir"
 *               cover:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cover.jpg"
 *               categoryId:
 *                 type: string
 *                 example: "60b3f7e8e4b0a7d5f8c9d1e5"
 *               isFeatured:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Book added successfully
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
 *                   example: "Book added successfully!"
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
    resource: Resource.BOOK,
    action: Action.CREATE,
  }),
  validateRequest(bookValidationSchema.createBookSchema),
  bookControllers.createBook
);

/**
 * @swagger
 * /book/all:
 *   get:
 *     summary: Get all Books (Public)
 *     description: Retrieve all books. Public endpoint.
 *     tags: [Book]
 *     responses:
 *       200:
 *         description: Successfully retrieved books
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
 *                   example: "Books retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/all", bookControllers.getAllBooks);

/**
 * @swagger
 * /book/admin/all:
 *   get:
 *     summary: Get all Books by Admins
 *     description: Retrieve all books with filtering and pagination. Requires ADMIN, MODERATOR, or SUPERADMIN role with READ permission for BOOK resource.
 *     tags: [Book]
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
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *     responses:
 *       200:
 *         description: Successfully retrieved books with pagination
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
 *                   example: "Books retrieved successfully!"
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
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPERADMIN],
    resource: Resource.BOOK,
    action: Action.READ,
  }),
  bookControllers.getAllBooksByAdmin
);

/**
 * @swagger
 * /book/{bookId}:
 *   get:
 *     summary: Get a specific Book by ID
 *     description: Retrieve a single book by its ID. Public endpoint.
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the book
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
 *                   example: "Book retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - book with the given ID does not exist
 */
router.get("/:bookId", bookControllers.getBookById);

/**
 * @swagger
 * /book/slug/{slug}:
 *   get:
 *     summary: Get a specific Book by slug
 *     description: Retrieve a single book by its slug. Public endpoint.
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the book to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the book
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
 *                   example: "Book retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - book with the given slug does not exist
 */
router.get("/slug/:slug", bookControllers.getBookBySlug);

/**
 * @swagger
 * /book/category/{categoryId}:
 *   get:
 *     summary: Get all Books by Category ID
 *     description: Retrieve all books belonging to a specific category. Public endpoint.
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: Successfully retrieved books for the category
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
 *                   example: "Book retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/category/:categoryId", bookControllers.getBooksByCategoryId);

/**
 * @swagger
 * /book/{bookId}:
 *   put:
 *     summary: Update a specific Book
 *     description: Update an existing book. Requires ADMIN or MODERATOR role with UPDATE permission for BOOK resource.
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cover:
 *                 type: string
 *                 format: uri
 *               categoryId:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Book updated successfully
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
 *                   example: "Book updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - book with the given ID does not exist
 */
router.put(
  "/:bookId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOK,
    action: Action.UPDATE,
  }),
  validateRequest(bookValidationSchema.updateBookSchema),
  bookControllers.updateBook
);

/**
 * @swagger
 * /book/{bookId}:
 *   delete:
 *     summary: Delete a Book (Soft Delete)
 *     description: Soft delete a book (mark as deleted). Requires ADMIN or MODERATOR role with DELETE permission for BOOK resource.
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to delete
 *     responses:
 *       200:
 *         description: Book removed successfully
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
 *                   example: "Book removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - book with the given ID does not exist
 */
router.delete(
  "/:bookId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOK,
    action: Action.DELETE,
  }),
  bookControllers.deleteBook
);

/**
 * @swagger
 * /book/admin/{bookId}:
 *   delete:
 *     summary: Delete a Book (Hard Delete) - Admin Only
 *     description: Permanently delete a book from database. Only ADMIN role can perform this operation.
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to permanently delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
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
 *                   example: "Book deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - book with the given ID does not exist
 */
router.delete(
  "/admin/:bookId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.BOOK,
    action: Action.DELETE,
  }),
  bookControllers.deleteBookByAdmin
);

export const bookRoutes = router;
