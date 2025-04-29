import express from "express";
import { blogValidationSchemas } from "./blog.validation";
import { blogControllers } from "./blog.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Route to create a new Blog
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(blogValidationSchemas.createBlogSchema),
  blogControllers.createBlog
);

// Route to get all Bog
router.get("/all", blogControllers.getAllBlogs);

// Route to get a specific Blog by ID
router.get("/:blogId", blogControllers.getBlogById);

// Route to get a specific Blog by slug
router.get("/slug/:slug", blogControllers.getBlogBySlug);

// Route to update an existing Blog by ID
router.put(
  "/:blogId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(blogValidationSchemas.updateBlogSchema),
  blogControllers.updateBlog
);

// Route to delete (soft delete) a Blog by id
router.delete(
  "/:blogId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  blogControllers.deleteBlog
);

// Route to delete (hard delete) a Tafsir by id only by Admins
router.delete(
  "/admin/:blogId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  blogControllers.deleteBlog
);

export const blogRoutes = router;
