import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { bookContentControllers } from "./bookContent.controller";
import { bookContentValidationSchema } from "./bookContent.validation";

const router = express.Router();

// Route to create a Book Content
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(bookContentValidationSchema.createContentSchema),
  bookContentControllers.createBookContent
);

// Route to get all Book Content
router.get("/all", bookContentControllers.getAllBookContent);

// Route to get a specific Book Content by ID
router.get("/:contentId", bookContentControllers.getBookContentById);

// Route to get a specific Book Contents by Book ID
router.get("/book/:bookId", bookContentControllers.getContentsByBookId);

// Route to update a specific Book Content
router.put(
  "/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(bookContentValidationSchema.updateContentSchema),
  bookContentControllers.updateBookContent
);

// Route to delete a Book (Soft Delete)
router.delete(
  "/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  bookContentControllers.deleteBookContent
);

// Route to delete a Book (Hard Delete) only by Admin
router.delete(
  "/admin/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookContentControllers.deleteBookContentByAdmin
);

export const bookContentRoutes = router;
