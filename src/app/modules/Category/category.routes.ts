import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { categoryControllers } from "./caregory.controller";
import { categoryValidationSchema } from "./category.validation";

const router = express.Router();

/**
 * @swagger
 * /category/:
 *   post:
 *     summary: Create a new Category
 *     description: Create a new book category. Requires ADMIN or MODERATOR role with CREATE permission for BOOKCATEGORY resource.
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tafsir"
 *     responses:
 *       200:
 *         description: Category created successfully
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
 *                   example: "Category created successfully!"
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
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.CREATE,
  }),
  validateRequest(categoryValidationSchema.createCategorySchema),
  categoryControllers.createCategory
);

/**
 * @swagger
 * /category/admin/all:
 *   get:
 *     summary: Get all Categories by Admins
 *     description: Retrieve all book categories. Requires ADMIN or MODERATOR role with READ permission for BOOKCATEGORY resource.
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
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
 *                   example: "All categories retrieved successfully!"
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
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
  }),
  categoryControllers.getAllCategoriesByAdmin
);

/**
 * @swagger
 * /category/{categoryId}:
 *   put:
 *     summary: Update a specific Category
 *     description: Update an existing category. Requires ADMIN or MODERATOR role with UPDATE permission for BOOKCATEGORY resource.
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *                   example: "Category updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - category with the given ID does not exist
 */
router.put(
  "/:categoryId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.UPDATE,
  }),
  validateRequest(categoryValidationSchema.updateCategorySchema),
  categoryControllers.updateCategory
);

/**
 * @swagger
 * /category/{categoryId}:
 *   delete:
 *     summary: Delete a Category (Soft Delete)
 *     description: Soft delete a category (mark as deleted). Requires ADMIN or MODERATOR role with DELETE permission for BOOKCATEGORY resource.
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category removed successfully
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
 *                   example: "Category removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - category with the given ID does not exist
 */
router.delete(
  "/:categoryId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.DELETE,
  }),
  categoryControllers.deleteCategory
);

/**
 * @swagger
 * /category/admin/{categoryId}:
 *   delete:
 *     summary: Delete a Category (Hard Delete) - Admin Only
 *     description: Permanently delete a category from database. Only ADMIN and MODERATOR roles can perform this operation.
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to permanently delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                   example: "Category deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - category with the given ID does not exist
 */
router.delete(
  "/admin/:categoryId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.DELETE,
  }),
  categoryControllers.deleteCategoryByAdmin
);

export const categoryRoutes = router;
