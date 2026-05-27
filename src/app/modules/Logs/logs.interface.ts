export type TLogLevel = "info" | "warn" | "error" | "debug" | "query";

export type TLogEntry = {
  timestamp: string;       // ISO datetime string
  level: TLogLevel;
  category: TLogCategory;
  message: string;
  method?: string;         // HTTP method (GET, POST, …)
  url?: string;            // request path
  statusCode?: number;     // HTTP status
  model?: string;          // DB model name
  operation?: string;      // DB operation (CREATED, UPDATED, …)
  rowCount?: number;       // rows affected
  durationMs?: number;     // duration in ms
  ip?: string;
  raw: string;             // original log line
};

export type TLogCategory =
  | "HTTP"     // [HTTP] lines
  | "DB"       // [DB] lines
  | "DB_ERROR" // [DB ERROR] lines
  | "SERVER"   // server startup / shutdown
  | "OTHER";   // everything else

export type TLogFilters = {
  level?: TLogLevel;
  category?: TLogCategory;
  dateFrom?: string;   // YYYY-MM-DD
  dateTo?: string;     // YYYY-MM-DD
  search?: string;     // free-text search in message
  method?: string;     // HTTP method filter
  statusCode?: string; // HTTP status code filter
  model?: string;      // DB model filter
};

export type TLogPagination = {
  page?: string;
  limit?: string;
  sortOrder?: string; // "asc" | "desc"  (by timestamp)
};

export type TLogQueryOptions = {
  filters: TLogFilters;
  pagination: TLogPagination;
};
