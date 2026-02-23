import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { bookControllers } from "./book.controller";
import { bookValidationSchema } from "./book.validation";

const router = express.Router();

// Route to create a Book
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

// Route to get all Book
router.get("/all", bookControllers.getAllBooks);

// Route to get all Book
router.get(
  "/admin/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
  }),
  bookControllers.getAllBooksByAdmin
);

// Route to get a specific Book by ID
router.get("/:bookId", bookControllers.getBookById);

// Route to get a specific Book by slug
router.get("/slug/:slug", bookControllers.getBookBySlug);

// Route to get all Books by Category ID
router.get("/category/:categoryId", bookControllers.getBooksByCategoryId);

// Route to update a specific Book
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

// Route to delete a Book (Soft Delete)
router.delete(
  "/:bookId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOK,
    action: Action.DELETE,
  }),
  bookControllers.deleteBook
);

// Route to delete a Book (Hard Delete) by Admin
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
