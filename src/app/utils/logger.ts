import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf } = winston.format;

// Log format
const logFormat = printf(
  ({ timestamp, level, message, method, url, statusCode, ip }) => {
    return `${timestamp} [${level.toUpperCase()}]: [${
      method || "-"
    }] ${url || "-"} ${statusCode || "-"} ${message} (IP: ${ip || "-"})`;
  }
);

// Single daily file
const dailyLogs = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d",
});

// Logger
const logger = winston.createLogger({
  level: "info",

  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),

  transports: [
    dailyLogs,

    new winston.transports.Console({
      format: combine(
        winston.format.colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

export default logger;
