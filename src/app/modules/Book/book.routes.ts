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
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookValidationSchema.createBookSchema),
  bookControllers.createBook
);

// Route to get all Book
router.get("/all", bookControllers.getAllBooks);

// Route to get a specific Book
router.get("/:bookId", bookControllers.getBookById);

// Route to update a specific Book
router.put(
  "/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookValidationSchema.updateBookSchema),
  bookControllers.updateBook
);

// Route to delete a Book
router.delete(
  "/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookControllers.deleteBook
);

export const bookRoutes = router;
