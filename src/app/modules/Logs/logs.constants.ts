export const logFilterableFields: string[] = [
  "level",
  "category",
  "dateFrom",
  "dateTo",
  "search",
  "method",
  "statusCode",
  "model",
];

export const logPaginationFields: string[] = ["page", "limit", "sortOrder"];

// Regex to parse a single log line produced by the Winston logFormat:
// "2026-05-27 13:39:54 [INFO]: [-] - - message (IP: ::1)"
// Groups: timestamp, level, method, url, statusCode, message, ip
export const LOG_LINE_REGEX =
  /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[([A-Z]+)\]: \[([^\]]*)\] ([^ ]*) ([^ ]*) (.*?) \(IP: ([^)]*)\)$/;
