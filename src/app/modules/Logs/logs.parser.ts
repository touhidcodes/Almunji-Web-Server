import { LOG_LINE_REGEX } from "./logs.constants";
import { TLogCategory, TLogEntry, TLogLevel } from "./logs.interface";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normaliseLevel = (raw: string): TLogLevel => {
  const l = raw.toLowerCase();
  if (
    l === "info" ||
    l === "warn" ||
    l === "error" ||
    l === "debug" ||
    l === "query"
  ) {
    return l as TLogLevel;
  }
  return "info";
};

const extractRowCount = (text: string): number | undefined => {
  // "[DB] CREATED 52 row(s) in [User]"
  const m = text.match(/(\d+)\s+row\(s\)/);
  return m ? Number(m[1]) : undefined;
};

const extractModel = (text: string): string | undefined => {
  // "[DB] CREATED 1 row(s) in [User]" or "[DB ERROR] FINDUNIQUE on [User]"
  // Match the last bracketed word that is a model name (capitalised)
  const matches = [...text.matchAll(/\[([A-Z][A-Za-z]+)\]/g)];
  // Skip category tags like [DB], [HTTP], [DB ERROR]
  const skip = new Set(["DB", "HTTP"]);
  for (const m of matches) {
    if (!skip.has(m[1])) return m[1];
  }
  // Fallback: "on User failed" or "in User"
  const fallback = text.match(/(?:in|on)\s+([A-Z][A-Za-z]+)/);
  return fallback ? fallback[1] : undefined;
};

const extractOperation = (text: string): string | undefined => {
  // "[DB] CREATED …" or "[DB ERROR] FINDUNIQUE on …"
  const m = text.match(/\[DB(?:\s+ERROR)?\]\s+([A-Z]+)/);
  return m ? m[1] : undefined;
};

const classifyCategory = (message: string): TLogCategory => {
  if (message.startsWith("[HTTP]")) return "HTTP";
  if (message.startsWith("[DB ERROR]")) return "DB_ERROR";
  if (message.startsWith("[DB]")) return "DB";
  if (
    message.includes("Server is running") ||
    message.includes("Shutting down") ||
    message.includes("Server closed")
  )
    return "SERVER";
  return "OTHER";
};

// ─── Main parser ──────────────────────────────────────────────────────────────

/**
 * Parse a single log line into a structured TLogEntry.
 * Returns null for lines that don't match the expected format.
 *
 * Log format written by Winston:
 *   "2026-05-27 13:39:54 [INFO]: [-] - - <message> (IP: <ip>)"
 *
 * The method/url/statusCode placeholders are always "-" in this logger config.
 * Real HTTP data lives inside the message: "[HTTP] POST /api/v1/login 200 — 2436ms"
 * Real DB data lives inside the message:   "[DB] CREATED 1 row(s) in [User] — 46ms"
 */
export const parseLogLine = (raw: string): TLogEntry | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const match = trimmed.match(LOG_LINE_REGEX);
  if (!match) return null;

  const [, ts, levelRaw, , , , message, ipRaw] = match;

  const level = normaliseLevel(levelRaw);
  const category = classifyCategory(message);
  const ip = ipRaw === "-" ? undefined : ipRaw;

  const entry: TLogEntry = {
    timestamp: ts.replace(" ", "T"), // "2026-05-27T13:39:54"
    level,
    category,
    message: message.trim(),
    ip,
    raw: trimmed,
  };

  // ── HTTP enrichment ────────────────────────────────────────────────────────
  // "[HTTP] POST /api/v1/login 200 — 2436ms"
  if (category === "HTTP") {
    const httpMatch = message.match(
      /\[HTTP\]\s+([A-Z]+)\s+(\S+)\s+(\d{3})\s+[—\-]+\s+(\d+)ms/
    );
    if (httpMatch) {
      entry.method = httpMatch[1];
      entry.url = httpMatch[2];
      entry.statusCode = Number(httpMatch[3]);
      entry.durationMs = Number(httpMatch[4]);
    }
  }

  // ── DB enrichment ─────────────────────────────────────────────────────────
  // "[DB] CREATED 1 row(s) in [User] — 46ms"
  // "[DB ERROR] FINDUNIQUE on User failed (430ms)"
  if (category === "DB" || category === "DB_ERROR") {
    const model = extractModel(message);
    const operation = extractOperation(message);
    const rowCount = extractRowCount(message);

    // Duration: either "— 46ms" or "(430ms)"
    const durMatch =
      message.match(/[—\-]+\s+(\d+)ms/) || message.match(/\((\d+)ms\)/);
    const durationMs = durMatch ? Number(durMatch[1]) : undefined;

    if (model) entry.model = model;
    if (operation) entry.operation = operation;
    if (rowCount !== undefined) entry.rowCount = rowCount;
    if (durationMs !== undefined) entry.durationMs = durationMs;
  }

  return entry;
};

/**
 * Parse an entire log file content into an array of structured entries.
 * Multi-line Prisma error blocks are collapsed into a single entry.
 */
export const parseLogFile = (content: string): TLogEntry[] => {
  const lines = content.split("\n");
  const entries: TLogEntry[] = [];

  let pendingRaw = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // A new entry always starts with a timestamp
    const startsNew = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(trimmed);

    if (startsNew) {
      if (pendingRaw) {
        const parsed = parseLogLine(pendingRaw);
        if (parsed) entries.push(parsed);
      }
      pendingRaw = trimmed;
    } else {
      // Continuation of a multi-line block (e.g. Prisma error stack)
      if (pendingRaw) pendingRaw += " " + trimmed;
    }
  }

  // Flush last block
  if (pendingRaw) {
    const parsed = parseLogLine(pendingRaw);
    if (parsed) entries.push(parsed);
  }

  return entries;
};
