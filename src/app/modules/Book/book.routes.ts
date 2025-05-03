import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { bookControllers } from "./book.controller";
import { bookValidationSchema } from "./book.validation";

const router = express.Router();

// Route to create a Book
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(bookValidationSchema.createBookSchema),
  bookControllers.createBook
);

// Route to get all Book
router.get("/all", bookControllers.getAllBooks);

// Route to get a specific Book by ID
router.get("/:bookId", bookControllers.getBookById);

// Route to get a specific Book by slug
router.get("/slug/:slug", bookControllers.getBookBySlug);

// Route to get all Books by Category ID
router.get("/category/:categoryId", bookControllers.getBooksByCategoryId);

// Route to update a specific Book
router.put(
  "/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(bookValidationSchema.updateBookSchema),
  bookControllers.updateBook
);

// Route to delete a Book (Soft Delete)
router.delete(
  "/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  bookControllers.deleteBook
);

// Route to delete a Book (Hard Delete) by Admin
router.delete(
  "/admin/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookControllers.deleteBookByAdmin
);

export const bookRoutes = router;
