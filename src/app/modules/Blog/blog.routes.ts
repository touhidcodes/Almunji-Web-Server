import express from "express";
import { blogValidationSchemas } from "./blog.validation";
import { blogControllers } from "./blog.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Route to create a new blog
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(blogValidationSchemas.createBlogSchema),
  blogControllers.createBlog
);

// Route to get all blog
router.get("/all", blogControllers.getBlogs);

router.get("/:blogId", blogControllers.getBlogById);

router.put(
  "/:blogId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(blogValidationSchemas.updateBlogSchema),
  blogControllers.updateBlog
);

router.delete(
  "/:blogId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  blogControllers.deleteBlog
);

export const blogRoutes = router;
