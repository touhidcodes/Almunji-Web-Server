import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { bookContentControllers } from "./bookContent.controller";

const router = express.Router();

// Route to create a Book
router.post(
  "/content",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookValidationSchema.createBookSchema),
  bookContentControllers.createBookContent
);

// Route to get all Book
router.get("/content/all", bookControllers.getAllBooks);

// Route to get a specific Book by ID
router.get("/content/:contentId", bookControllers.getBookById);

// Route to update a specific Book
router.put(
  "/content/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookValidationSchema.updateBookSchema),
  bookControllers.updateBook
);

// Route to delete a Book (Soft Delete)
router.delete(
  "/content/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  bookControllers.deleteBook
);

// Route to delete a Book (Hard Delete) by Admin
router.delete(
  "/content/admin/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookControllers.deleteBookByAdmin
);

export const bookRoutes = router;
