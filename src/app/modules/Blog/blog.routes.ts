import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import express from "express";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { blogControllers } from "./blog.controller";
import { blogValidationSchemas } from "./blog.validation";

const router = express.Router();

/**
 * @swagger
 * /blog/:
 *   post:
 *     summary: Create a new Blog
 *     description: Create a new blog post with title, content, and optional metadata. Requires SUPERADMIN, ADMIN, or MODERATOR role with CREATE permission for BLOG resource.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Importance of Prayer"
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/thumbnail.jpg"
 *               summary:
 *                 type: string
 *                 example: "Learn about the significance of prayer in Islam"
 *               content:
 *                 type: string
 *                 example: "Prayer is one of the five pillars of Islam..."
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *               IsFeatured:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blog created successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
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

/**
 * @swagger
 * /blog/all:
 *   get:
 *     summary: Get all Blogs (Public)
 *     description: Retrieve all blog posts without authentication.
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Successfully retrieved blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blogs retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/all", blogControllers.getAllBlogs);

/**
 * @swagger
 * /blog/admin/all:
 *   get:
 *     summary: Get all Blogs by Admins
 *     description: Retrieve all blog posts with filtering and pagination. Requires SUPERADMIN, ADMIN, or MODERATOR role with READ permission for BLOG resource.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: Successfully retrieved blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blogs retrieved successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BLOG,
    action: Action.READ,
  }),
  blogControllers.getAllBlogsByAdmin
);

/**
 * @swagger
 * /blog/{blogId}:
 *   get:
 *     summary: Get a specific Blog by ID
 *     description: Retrieve a single blog post by its ID. Public endpoint.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blog retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - blog post with the given ID does not exist
 */
router.get("/:blogId", blogControllers.getBlogById);

/**
 * @swagger
 * /blog/slug/{slug}:
 *   get:
 *     summary: Get a specific Blog by slug
 *     description: Retrieve a single blog post by its slug. Public endpoint.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the blog post to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blog retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - blog post with the given slug does not exist
 */
router.get("/slug/:slug", blogControllers.getBlogBySlug);

/**
 * @swagger
 * /blog/{blogId}:
 *   put:
 *     summary: Update an existing Blog
 *     description: Update an existing blog post. Requires SUPERADMIN, ADMIN, or MODERATOR role with UPDATE permission for BLOG resource.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *               IsFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blog updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - blog post with the given ID does not exist
 */
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

/**
 * @swagger
 * /blog/{blogId}:
 *   delete:
 *     summary: Delete a Blog (Soft Delete)
 *     description: Soft delete a blog post (mark as deleted). Requires SUPERADMIN, ADMIN, or MODERATOR role with DELETE permission for BLOG resource.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blog removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - blog post with the given ID does not exist
 */
router.delete(
  "/:blogId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BLOG,
    action: Action.DELETE,
  }),
  blogControllers.deleteBlog
);

/**
 * @swagger
 * /blog/admin/{blogId}:
 *   delete:
 *     summary: Delete a Blog (Hard Delete) - Admin Only
 *     description: Permanently delete a blog post from database. Only SUPERADMIN and ADMIN roles can perform this operation.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to permanently delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Blog deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - blog post with the given ID does not exist
 */
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
