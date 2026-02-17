import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { bookmarkControllers } from "./bookmark.controller";
import { bookmarkValidationSchema } from "./bookmark.validation";

const router = express.Router();

// Create a bookmark
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  validateRequest(bookmarkValidationSchema.createBookmarkSchema), // optional
  bookmarkControllers.createBookmark
);

// Get all bookmarks of logged-in user
router.get(
  "/me",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  bookmarkControllers.getMyBookmarks
);

// Get single bookmark of logged-in user
router.get(
  "/:bookmarkId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  bookmarkControllers.getSingleBookmark
);

// Delete bookmark by user
router.delete(
  "/:bookmarkId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  bookmarkControllers.deleteBookmark
)

// Get all bookmarks (admin only)
router.get(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookmarkControllers.getAllBookmarksByAdmin
);

// Hard delete a bookmark (admin only)
router.delete(
  "/admin/:bookmarkId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  bookmarkControllers.deleteBookmarkByAdmin
);

export const bookmarkRoutes = router;
