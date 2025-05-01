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

// Route to get all Book
router.get("/content/all", bookContentControllers.getAllBookContent);

// Route to get a specific Book by ID
router.get("/content/:contentId", bookContentControllers.getBookContentById);

// Route to update a specific Book
router.put(
  "/content/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(bookContentValidationSchema.updateContentSchema),
  bookContentControllers.updateBookContent
);

// Route to delete a Book (Soft Delete)
router.delete(
  "/content/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  bookContentControllers.deleteBookContent
);

// Route to delete a Book (Hard Delete) by Admin
router.delete(
  "/content/admin/:contentId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookContentControllers.deleteBookContentByAdmin
);

export const bookContentRoutes = router;
