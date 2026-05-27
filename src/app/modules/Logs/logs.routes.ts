import express from "express";
import { UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import { logsControllers } from "./logs.controller";

const router = express.Router();

// All log routes are restricted to SUPERADMIN and ADMIN only
const adminOnly = authAccess({
  roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
});

// GET /api/v1/logs/files
// List all log files available on disk
router.get("/files", adminOnly, logsControllers.getLogFiles);

// GET /api/v1/logs/summary
// Analytics summary — counts, averages, top errors
// ?level=error&dateFrom=2026-05-01&dateTo=2026-05-31
router.get("/summary", adminOnly, logsControllers.getLogSummary);

// GET /api/v1/logs/file/:filename
// Entries from a single named file
// ?level=error&page=1&limit=50&sortOrder=desc
router.get("/file/:filename", adminOnly, logsControllers.getLogsByFile);

// GET /api/v1/logs
// All entries merged from every log file, with full filter + pagination
// ?level=error|warn|info
// ?category=HTTP|DB|DB_ERROR|SERVER|OTHER
// ?dateFrom=2026-05-01&dateTo=2026-05-31
// ?method=POST&statusCode=401
// ?model=User
// ?search=login
// ?page=1&limit=50&sortOrder=desc
router.get("/", adminOnly, logsControllers.getLogs);

export const logsRoutes = router;
