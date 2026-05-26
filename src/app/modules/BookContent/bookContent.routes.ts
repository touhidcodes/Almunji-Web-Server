import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { bookContentControllers } from "./bookContent.controller";
import { bookContentValidationSchema } from "./bookContent.validation";

const router = express.Router();

// Route to create a Book Content
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.CREATE,
  }),
  validateRequest(bookContentValidationSchema.createContentSchema),
  bookContentControllers.createBookContent
);

// Route to get all Book Content
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.READ,
  }),
  bookContentControllers.getAllBookContentByAdmin
);

// Route to get a specific Book Content by ID
router.get("/:contentId", bookContentControllers.getBookContentById);

// Route to get a specific Book Contents by Book ID
router.get("/book/:bookId", bookContentControllers.getContentsByBookId);

// Route to get a specific Book Index by Book ID
router.get("/index/:bookId", bookContentControllers.getBookIndexByBookId);

// Route to update a specific Book Content
router.put(
  "/:contentId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.UPDATE,
  }),
  validateRequest(bookContentValidationSchema.updateContentSchema),
  bookContentControllers.updateBookContent
);

// Route to delete a Book Content (Soft Delete)
router.delete(
  "/:contentId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCONTENT,
    action: Action.DELETE,
  }),
  bookContentControllers.deleteBookContent
);

// Route to delete a Book Content (Hard Delete) only by Admin
router.delete(
  "/admin/:contentId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.BOOKCONTENT,
    action: Action.DELETE,
  }),
  bookContentControllers.deleteBookContentByAdmin
);

export const bookContentRoutes = router;
