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
 *     description: Get comprehensive dashboard statistics. SUPERADMIN/ADMIN get all stats including users. MODERATOR gets stats only for resources they have READ permission for. Minimal 2 queries for MODERATOR (1 for permissions, 1-18 for stats based on permissions)
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
 *                       description: Only for SUPERADMIN/ADMIN, 0 for MODERATOR
 *                     activeUsers:
 *                       type: integer
 *                       description: Only for SUPERADMIN/ADMIN, 0 for MODERATOR
 *                     blockedUsers:
 *                       type: integer
 *                       description: Only for SUPERADMIN/ADMIN, 0 for MODERATOR
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
