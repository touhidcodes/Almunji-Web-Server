import express from "express";
import { UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import { logsControllers } from "./logs.controller";

const router = express.Router();

// All log routes are restricted to SUPERADMIN and ADMIN only
const adminOnly = authAccess({
  roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
});

/**
 * @swagger
 * /logs/files:
 *   get:
 *     summary: List all log files
 *     description: List all available log files on disk (SUPERADMIN, ADMIN only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of log files
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/files", adminOnly, logsControllers.getLogFiles);

/**
 * @swagger
 * /logs/summary:
 *   get:
 *     summary: Get log analytics summary
 *     description: Get analytics summary with counts, averages, top errors (SUPERADMIN, ADMIN only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info]
 *         description: Filter by log level
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Log analytics summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/summary", adminOnly, logsControllers.getLogSummary);

/**
 * @swagger
 * /logs/file/{filename}:
 *   get:
 *     summary: Get log entries from a specific file
 *     description: Get log entries from a single named file (SUPERADMIN, ADMIN only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Log filename
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info]
 *         description: Filter by log level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [desc, asc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Log entries from file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/file/:filename", adminOnly, logsControllers.getLogsByFile);

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get all logs with filtering and pagination
 *     description: Get all log entries merged from all files with full filtering and pagination (SUPERADMIN, ADMIN only)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info]
 *         description: Filter by log level
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [HTTP, DB, DB_ERROR, SERVER, OTHER]
 *         description: Filter by category
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: Filter by HTTP method
 *       - in: query
 *         name: statusCode
 *         schema:
 *           type: integer
 *         description: Filter by status code
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filter by model
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [desc, asc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Log entries with pagination
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", adminOnly, logsControllers.getLogs);

export const logsRoutes = router;
