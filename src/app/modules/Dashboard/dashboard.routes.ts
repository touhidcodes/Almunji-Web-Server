import express from "express";
import { UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import { dashboardControllers } from "./dashboard.controller";

const router = express.Router();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Get comprehensive dashboard statistics with real-time counts for all resources. Returns user counts (total, active, blocked), content counts (Surahs, Paras, Ayahs, Tafsirs, Dictionaries, Books, Blogs, Duas), and bookmark statistics.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     blockedUsers:
 *                       type: integer
 *                     totalSurahs:
 *                       type: integer
 *                     totalParas:
 *                       type: integer
 *                     totalAyahs:
 *                       type: integer
 *                     totalTafsirs:
 *                       type: integer
 *                     totalDictionaries:
 *                       type: integer
 *                     activeDictionaries:
 *                       type: integer
 *                     totalBooks:
 *                       type: integer
 *                     totalBookCategories:
 *                       type: integer
 *                     totalBookContents:
 *                       type: integer
 *                     totalBlogs:
 *                       type: integer
 *                     publishedBlogs:
 *                       type: integer
 *                     featuredBlogs:
 *                       type: integer
 *                     totalDuas:
 *                       type: integer
 *                     totalBookmarks:
 *                       type: integer
 *                     bookmarkedAyahs:
 *                       type: integer
 *                     bookmarkedDuas:
 *                       type: integer
 *                     featuredBooks:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/stats",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  }),
  dashboardControllers.getDashboardStats
);

export const dashboardRoutes = router;
