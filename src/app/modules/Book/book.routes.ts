import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { bookControllers } from "./book.controller";
import { bookValidationSchema } from "./book.validation";

const router = express.Router();

router.post(
  "/book",
  // auth(UserRole.ADMIN),
  validateRequest(bookValidationSchema.createBookSchema),
  bookControllers.createBook
);

router.get("/books", bookControllers.getAllBooks);

router.get("/book/:bookId", bookControllers.getSingleBook);

router.put(
  "/book/:bookId",
  // auth(UserRole.ADMIN),
  //   validateRequest(bookValidationSchema.updateBookSchema),
  bookControllers.updateBook
);

router.delete(
  "/book/:bookId",
  // auth(UserRole.ADMIN),
  bookControllers.deleteBook
);

export const bookRoutes = router;
