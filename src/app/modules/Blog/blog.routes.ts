import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { blogControllers } from "./blog.controller";
import { blogValidationSchemas } from "./blog.validation";

const router = express.Router();

// Route to create a new Blog
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BLOG,
    action: Action.CREATE,
  }),
  validateRequest(blogValidationSchemas.createBlogSchema),
  blogControllers.createBlog
);

// Route to get all Bog
router.get("/all", blogControllers.getAllBlogs);

// Route to get all Bog by admin
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BLOG,
    action: Action.READ,
  }),
  blogControllers.getAllBlogsByAdmin
);

// Route to get a specific Blog by ID
router.get("/:blogId", blogControllers.getBlogById);

// Route to get a specific Blog by slug
router.get("/slug/:slug", blogControllers.getBlogBySlug);

// Route to update an existing Blog by ID
router.put(
  "/:blogId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BLOG,
    action: Action.UPDATE,
  }),
  validateRequest(blogValidationSchemas.updateBlogSchema),
  blogControllers.updateBlog
);

// Route to delete (soft delete) a Blog by id
router.delete(
  "/:blogId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BLOG,
    action: Action.DELETE,
  }),
  blogControllers.deleteBlog
);

// Route to delete (hard delete) a Tafsir by id only by Admins
router.delete(
  "/admin/:blogId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.BLOG,
    action: Action.DELETE,
  }),
  blogControllers.deleteBlogByAdmin
);

export const blogRoutes = router;
