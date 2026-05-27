import fs from "fs";
import path from "path";
import httpStatus from "http-status";
import APIError from "@/errors/APIError";
import { TLogEntry, TLogFilters, TLogPagination } from "./logs.interface";
import { parseLogFile } from "./logs.parser";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LOGS_DIR = path.join(process.cwd(), "logs");

/** Return all *.log files sorted newest-first */
const getLogFiles = (): string[] => {
  if (!fs.existsSync(LOGS_DIR)) return [];

  return fs
    .readdirSync(LOGS_DIR)
    .filter((f) => f.endsWith(".log"))
    .sort()
    .reverse(); // newest date first
};

/** Read and parse every log file, returning a flat merged array */
const readAllEntries = (): TLogEntry[] => {
  const files = getLogFiles();
  const all: TLogEntry[] = [];

  for (const file of files) {
    const filePath = path.join(LOGS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const entries = parseLogFile(content);
      all.push(...entries);
    } catch {
      // skip unreadable files
    }
  }

  return all;
};

// ─── Filter ───────────────────────────────────────────────────────────────────

const applyFilters = (entries: TLogEntry[], filters: TLogFilters): TLogEntry[] => {
  let result = entries;

  if (filters.level) {
    result = result.filter((e) => e.level === filters.level);
  }

  if (filters.category) {
    result = result.filter((e) => e.category === filters.category);
  }

  if (filters.method) {
    result = result.filter(
      (e) => e.method?.toUpperCase() === filters.method!.toUpperCase()
    );
  }

  if (filters.statusCode) {
    const code = Number(filters.statusCode);
    if (!isNaN(code)) {
      result = result.filter((e) => e.statusCode === code);
    }
  }

  if (filters.model) {
    result = result.filter(
      (e) => e.model?.toLowerCase() === filters.model!.toLowerCase()
    );
  }

  if (filters.dateFrom) {
    // dateFrom is YYYY-MM-DD — compare against timestamp prefix
    result = result.filter((e) => e.timestamp.slice(0, 10) >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    result = result.filter((e) => e.timestamp.slice(0, 10) <= filters.dateTo!);
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.message.toLowerCase().includes(term) ||
        e.url?.toLowerCase().includes(term) ||
        e.model?.toLowerCase().includes(term)
    );
  }

  return result;
};

// ─── Services ─────────────────────────────────────────────────────────────────

/** List available log file names */
const getLogFileList = () => {
  return getLogFiles().map((f) => ({
    filename: f,
    path: path.join(LOGS_DIR, f),
    sizeKB: Math.round(fs.statSync(path.join(LOGS_DIR, f)).size / 1024),
  }));
};

/** Get paginated + filtered log entries from all files */
const getLogs = (filters: TLogFilters, pagination: TLogPagination) => {
  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.min(500, Math.max(1, Number(pagination.limit) || 50));
  const sortOrder = pagination.sortOrder === "asc" ? "asc" : "desc";

  let entries = readAllEntries();

  // Sort by timestamp before filtering
  entries.sort((a, b) => {
    const cmp = a.timestamp.localeCompare(b.timestamp);
    return sortOrder === "asc" ? cmp : -cmp;
  });

  entries = applyFilters(entries, filters);

  const total = entries.length;
  const skip = (page - 1) * limit;
  const data = entries.slice(skip, skip + limit);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data,
  };
};

/** Get log entries from a single named file */
const getLogsByFile = (
  filename: string,
  filters: TLogFilters,
  pagination: TLogPagination
) => {
  const safeName = path.basename(filename); // prevent path traversal
  const filePath = path.join(LOGS_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    throw new APIError(httpStatus.NOT_FOUND, `Log file "${safeName}" not found`);
  }

  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.min(500, Math.max(1, Number(pagination.limit) || 50));
  const sortOrder = pagination.sortOrder === "asc" ? "asc" : "desc";

  const content = fs.readFileSync(filePath, "utf-8");
  let entries = parseLogFile(content);

  entries.sort((a, b) => {
    const cmp = a.timestamp.localeCompare(b.timestamp);
    return sortOrder === "asc" ? cmp : -cmp;
  });

  entries = applyFilters(entries, filters);

  const total = entries.length;
  const skip = (page - 1) * limit;
  const data = entries.slice(skip, skip + limit);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data,
  };
};

/** Aggregate analytics summary across all log files */
const getLogSummary = (filters: TLogFilters) => {
  let entries = readAllEntries();
  entries = applyFilters(entries, filters);

  const total = entries.length;

  // Count by level
  const byLevel: Record<string, number> = {};
  for (const e of entries) {
    byLevel[e.level] = (byLevel[e.level] || 0) + 1;
  }

  // Count by category
  const byCategory: Record<string, number> = {};
  for (const e of entries) {
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
  }

  // HTTP stats
  const httpEntries = entries.filter((e) => e.category === "HTTP");
  const byStatusCode: Record<string, number> = {};
  const byMethod: Record<string, number> = {};
  let totalHttpDuration = 0;
  let httpCount = 0;

  for (const e of httpEntries) {
    if (e.statusCode) {
      byStatusCode[e.statusCode] = (byStatusCode[e.statusCode] || 0) + 1;
    }
    if (e.method) {
      byMethod[e.method] = (byMethod[e.method] || 0) + 1;
    }
    if (e.durationMs !== undefined) {
      totalHttpDuration += e.durationMs;
      httpCount++;
    }
  }

  // DB stats
  const dbEntries = entries.filter((e) => e.category === "DB");
  const byModel: Record<string, number> = {};
  const byOperation: Record<string, number> = {};
  let totalDbDuration = 0;
  let dbCount = 0;

  for (const e of dbEntries) {
    if (e.model) {
      byModel[e.model] = (byModel[e.model] || 0) + 1;
    }
    if (e.operation) {
      byOperation[e.operation] = (byOperation[e.operation] || 0) + 1;
    }
    if (e.durationMs !== undefined) {
      totalDbDuration += e.durationMs;
      dbCount++;
    }
  }

  // Top 5 slowest HTTP requests
  const slowestRequests = [...httpEntries]
    .filter((e) => e.durationMs !== undefined)
    .sort((a, b) => (b.durationMs ?? 0) - (a.durationMs ?? 0))
    .slice(0, 5)
    .map((e) => ({
      timestamp: e.timestamp,
      method: e.method,
      url: e.url,
      statusCode: e.statusCode,
      durationMs: e.durationMs,
    }));

  // Recent errors (last 10)
  const recentErrors = entries
    .filter((e) => e.level === "error")
    .slice(0, 10)
    .map((e) => ({
      timestamp: e.timestamp,
      category: e.category,
      message: e.message,
    }));

  return {
    total,
    byLevel,
    byCategory,
    http: {
      total: httpEntries.length,
      byStatusCode,
      byMethod,
      avgDurationMs: httpCount > 0 ? Math.round(totalHttpDuration / httpCount) : 0,
      slowestRequests,
    },
    db: {
      total: dbEntries.length,
      byModel,
      byOperation,
      avgDurationMs: dbCount > 0 ? Math.round(totalDbDuration / dbCount) : 0,
    },
    recentErrors,
  };
};

export const logsServices = {
  getLogFileList,
  getLogs,
  getLogsByFile,
  getLogSummary,
};
