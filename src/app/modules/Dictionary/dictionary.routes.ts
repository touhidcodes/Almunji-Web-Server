import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { dictionaryControllers } from "./dictionary.controller";
import { dictionaryValidationSchema } from "./dictionary.validation";

const router = express.Router();

/**
 * @swagger
 * /dictionary/word:
 *   post:
 *     summary: Create a new Dictionary Word
 *     description: Create a new dictionary word with Persian word, meanings, and examples. Requires ADMIN or MODERATOR role with CREATE permission for DICTIONARY resource.
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - persianWord
 *               - banglaMeaning
 *             properties:
 *               persianWord:
 *                 type: string
 *                 example: "محتاط"
 *               transliteration:
 *                 type: string
 *                 example: "muḥtaṭ"
 *               banglaMeaning:
 *                 type: string
 *                 example: "সতর্ক, সাবধান"
 *               englishMeaning:
 *                 type: string
 *                 example: "cautious, careful"
 *               exampleFA:
 *                 type: string
 *                 example: "او محتاط عمل کرد"
 *               exampleEN:
 *                 type: string
 *                 example: "He acted cautiously"
 *               exampleBN:
 *                 type: string
 *                 example: "সে সতর্কভাবে কাজ করল"
 *     responses:
 *       200:
 *         description: Word created successfully
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
 *                   example: "Word created successfully!"
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
  "/word",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.CREATE,
  }),
  validateRequest(dictionaryValidationSchema.createWordSchema),
  dictionaryControllers.createWord
);

/**
 * @swagger
 * /dictionary/suggestion:
 *   get:
 *     summary: Get Dictionary Word Suggestions
 *     description: Get word suggestions for auto-complete. Public endpoint.
 *     tags: [Dictionary]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for suggestions
 *     responses:
 *       200:
 *         description: Successfully retrieved word suggestions
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
 *                   example: "Words retrieved successfully!"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/suggestion", dictionaryControllers.getSuggestion);

/**
 * @swagger
 * /dictionary/admin/words:
 *   get:
 *     summary: Get all Dictionary Words by Admins
 *     description: Retrieve all dictionary words with filtering and pagination. Requires ADMIN or MODERATOR role with READ permission for DICTIONARY resource.
 *     tags: [Dictionary]
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
 *     responses:
 *       200:
 *         description: Successfully retrieved all words
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
 *                   example: "All words retrieved successfully!"
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
  "/admin/words",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.READ,
  }),
  dictionaryControllers.getAllWordsByAdmin
);

/**
 * @swagger
 * /dictionary/{wordId}:
 *   get:
 *     summary: Get a specific Dictionary Word by ID
 *     description: Retrieve a single dictionary word by its ID. Public endpoint.
 *     tags: [Dictionary]
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dictionary word to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the dictionary word
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
 *                   example: "Word retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - dictionary word with the given ID does not exist
 */
router.get("/:wordId", dictionaryControllers.getWordById);

/**
 * @swagger
 * /dictionary/{wordId}:
 *   put:
 *     summary: Update an existing Dictionary Word
 *     description: Update an existing dictionary word. Requires ADMIN or MODERATOR role with UPDATE permission for DICTIONARY resource.
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dictionary word to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               persianWord:
 *                 type: string
 *               transliteration:
 *                 type: string
 *               banglaMeaning:
 *                 type: string
 *               englishMeaning:
 *                 type: string
 *               exampleFA:
 *                 type: string
 *               exampleEN:
 *                 type: string
 *               exampleBN:
 *                 type: string
 *               isDeleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Word updated successfully
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
 *                   example: "Word updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - dictionary word with the given ID does not exist
 */
router.put(
  "/:wordId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.UPDATE,
  }),
  validateRequest(dictionaryValidationSchema.updateWordSchema),
  dictionaryControllers.updateWord
);

/**
 * @swagger
 * /dictionary/{wordId}:
 *   delete:
 *     summary: Delete a Dictionary Word (Soft Delete)
 *     description: Soft delete a dictionary word (mark as deleted). Requires ADMIN or MODERATOR role with DELETE permission for DICTIONARY resource.
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dictionary word to delete
 *     responses:
 *       200:
 *         description: Word removed successfully
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
 *                   example: "Word removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - dictionary word with the given ID does not exist
 */
router.delete(
  "/:wordId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.DELETE,
  }),
  dictionaryControllers.deleteWord
);

/**
 * @swagger
 * /dictionary/admin/{wordId}:
 *   delete:
 *     summary: Delete a Dictionary Word (Hard Delete) - Admin Only
 *     description: Permanently delete a dictionary word from database. Only ADMIN role can perform this operation.
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dictionary word to permanently delete
 *     responses:
 *       200:
 *         description: Word deleted successfully
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
 *                   example: "Word deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - dictionary word with the given ID does not exist
 */
router.delete(
  "/admin/:wordId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.DICTIONARY,
    action: Action.DELETE,
  }),
  dictionaryControllers.deleteWordByAdmin
);

export const dictionaryRoutes = router;
