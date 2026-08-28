import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import express from "express";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { ayahControllers } from "./ayah.controller";
import { ayahValidationSchema } from "./ayah.validation";

const router = express.Router();

/**
 * @swagger
 * /ayah/:
 *   post:
 *     summary: Create a new Ayah
 *     description: Create a new Ayah with Surah reference, Arabic text, and translations. Requires SUPERADMIN, ADMIN, or MODERATOR role with CREATE permission for AYAH resource.
 *     tags: [Ayah]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - surahId
 *               - paraId
 *               - number
 *               - arabic
 *             properties:
 *               surahId:
 *                 type: string
 *                 example: "60b3f7e8e4b0a7d5f8c9d1e2"
 *               paraId:
 *                 type: string
 *                 example: "60b3f7e8e4b0a7d5f8c9d1e3"
 *               number:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               arabic:
 *                 type: string
 *                 example: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
 *               transliteration:
 *                 type: string
 *                 example: "Bismillah ir-Rahman ir-Rahim"
 *               bangla:
 *                 type: string
 *                 example: "আল্লাহর নামে শুরু করি, যিনি অতি দয়ালু ও রহমতের ধাম"
 *               english:
 *                 type: string
 *                 example: "In the name of Allah, the Entirely Merciful, the Especially Merciful"
 *     responses:
 *       200:
 *         description: Ayah created successfully
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
 *                   example: "Ayah created successfully!"
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
    resource: Resource.AYAH,
    action: Action.CREATE,
  }),
  validateRequest(ayahValidationSchema.createAyahSchema),
  ayahControllers.createAyah
);

/**
 * @swagger
 * /ayah/all:
 *   get:
 *     summary: Get all Ayahs
 *     description: Retrieve all Ayahs with filtering and pagination. Public endpoint.
 *     tags: [Ayah]
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
 *         description: Successfully retrieved Ayahs
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
 *                   example: "Ayahs retrieved successfully!"
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
router.get("/all", ayahControllers.getAllAyahs);

/**
 * @swagger
 * /ayah/{ayahId}:
 *   get:
 *     summary: Get a specific Ayah by ID
 *     description: Retrieve a single Ayah by its ID. Public endpoint.
 *     tags: [Ayah]
 *     parameters:
 *       - in: path
 *         name: ayahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Ayah to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the Ayah
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
 *                   example: "Ayah retrieved successfully!"
 *                 data:
 *                   type: object
 *       404:
 *         description: Not found - Ayah with the given ID does not exist
 */
router.get("/:ayahId", ayahControllers.getAyahById);

/**
 * @swagger
 * /ayah/para/{paraId}:
 *   get:
 *     summary: Get Ayahs by Para ID
 *     description: Retrieve all Ayahs belonging to a specific Para (Juz). Public endpoint.
 *     tags: [Ayah]
 *     parameters:
 *       - in: path
 *         name: paraId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Para
 *     responses:
 *       200:
 *         description: Successfully retrieved Ayahs for the Para
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
 *                   example: "Para wise ayahs fetched successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/para/:paraId", ayahControllers.getAyahsByParaId);

/**
 * @swagger
 * /ayah/surah/{surahId}:
 *   get:
 *     summary: Get Ayahs by Surah ID
 *     description: Retrieve all Ayahs belonging to a specific Surah. Public endpoint.
 *     tags: [Ayah]
 *     parameters:
 *       - in: path
 *         name: surahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Surah
 *     responses:
 *       200:
 *         description: Successfully retrieved Ayahs for the Surah
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
 *                   example: "Surah wise ayahs fetched successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/surah/:surahId", ayahControllers.getAyahsBySurahId);

/**
 * @swagger
 * /ayah/tafsir/{surahId}:
 *   get:
 *     summary: Get Ayahs and their Tafsir by Surah ID
 *     description: Retrieve Ayahs along with their Tafsir for a specific Surah. Public endpoint.
 *     tags: [Ayah]
 *     parameters:
 *       - in: path
 *         name: surahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Surah
 *     responses:
 *       200:
 *         description: Successfully retrieved Ayahs with Tafsir
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
 *                   example: "Surah wise ayahs fetched successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/tafsir/:surahId", ayahControllers.getAyahsAndTafsirBySurahId);

/**
 * @swagger
 * /ayah/{ayahId}:
 *   put:
 *     summary: Update an existing Ayah
 *     description: Update an existing Ayah. Note: number, surahId, and paraId cannot be updated. Requires SUPERADMIN, ADMIN, or MODERATOR role with UPDATE permission for AYAH resource.
 *     tags: [Ayah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ayahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Ayah to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               arabic:
 *                 type: string
 *               transliteration:
 *                 type: string
 *               bangla:
 *                 type: string
 *               english:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ayah updated successfully
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
 *                   example: "Ayah updated successfully!"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - restricted fields cannot be updated
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Ayah with the given ID does not exist
 */
router.put(
  "/:ayahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.UPDATE,
  }),
  validateRequest(ayahValidationSchema.updateAyahSchema),
  ayahControllers.updateAyah
);

/**
 * @swagger
 * /ayah/{ayahId}:
 *   delete:
 *     summary: Delete an Ayah (Soft Delete)
 *     description: Soft delete an Ayah (mark as deleted). Requires SUPERADMIN, ADMIN, or MODERATOR role with DELETE permission for AYAH resource.
 *     tags: [Ayah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ayahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Ayah to delete
 *     responses:
 *       200:
 *         description: Ayah removed successfully
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
 *                   example: "Ayah removed successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Ayah with the given ID does not exist
 */
router.delete(
  "/:ayahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.DELETE,
  }),
  ayahControllers.deleteAyah
);

/**
 * @swagger
 * /ayah/admin/{ayahId}:
 *   delete:
 *     summary: Delete an Ayah (Hard Delete) - Admin Only
 *     description: Permanently delete an Ayah from database. Only ADMIN and SUPERADMIN roles can perform this operation.
 *     tags: [Ayah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ayahId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Ayah to permanently delete
 *     responses:
 *       200:
 *         description: Ayah deleted successfully
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
 *                   example: "Ayah deleted successfully!"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - not authenticated
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Not found - Ayah with the given ID does not exist
 */
router.delete(
  "/admin/:ayahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.AYAH,
    action: Action.DELETE,
  }),
  ayahControllers.deleteAyahByAdmin
);

export const ayahRoutes = router;
