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
 *     description: Get comprehensive dashboard statistics. SUPERADMIN sees all data, ADMIN sees all data, MODERATOR sees only data for roles they have permission for
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
