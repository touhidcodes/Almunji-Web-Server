import express from "express";
import { blogValidationSchemas } from "./blog.validation";
import { blogControllers } from "./blog.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", blogControllers.getBlogs);

router.post(
  "/",
  auth(),
  validateRequest(blogValidationSchemas.createBlogSchema),
  blogControllers.createBlog
);

router.get("/:blogId", blogControllers.getBlogById);

router.put(
  "/:blogId",
  auth(),
  validateRequest(blogValidationSchemas.updateBlogSchema),
  blogControllers.updateBlog
);

router.delete("/:blogId", auth(), blogControllers.deleteBlog);

export const blogRoutes = router;
