import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { bookControllers } from "./book.controller";
import { bookValidationSchema } from "./book.validation";

const router = express.Router();

// Route to create a book
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookValidationSchema.createBookSchema),
  bookControllers.createBook
);

// Route to get all book
router.get("/all", bookControllers.getAllBooks);

// Route to get a specific book
router.get("/:bookId", bookControllers.getSingleBook);

// Route to update a specific book
router.put(
  "/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookValidationSchema.updateBookSchema),
  bookControllers.updateBook
);

// Route to delete a book
router.delete(
  "/:bookId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookControllers.deleteBook
);

export const bookRoutes = router;
