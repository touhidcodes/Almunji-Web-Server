import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { bookmarkControllers } from "./bookmark.controller";
import { bookmarkValidationSchema } from "./bookmark.validation";

const router = express.Router();

// Create a bookmark
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.CREATE,
  }),
  validateRequest(bookmarkValidationSchema.createBookmarkSchema),
  bookmarkControllers.createBookmark
);

// Get all bookmarks of logged-in user
router.get(
  "/me",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.READ,
  }),
  bookmarkControllers.getMyBookmarks
);

// Get single bookmark of logged-in user
router.get(
  "/:bookmarkId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.READ,
  }),
  bookmarkControllers.getSingleBookmark
);

// Delete bookmark by user
router.delete(
  "/:bookmarkId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
    resource: Resource.BOOKMARK,
    action: Action.DELETE,
  }),
  bookmarkControllers.deleteBookmark
);

// Get all bookmarks
router.get(
  "/",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.BOOKMARK,
    action: Action.READ,
  }),
  bookmarkControllers.getAllBookmarksByAdmin
);

// Hard delete a bookmark
router.delete(
  "/admin/:bookmarkId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.BOOKMARK,
    action: Action.DELETE,
  }),
  bookmarkControllers.deleteBookmarkByAdmin
);

export const bookmarkRoutes = router;
