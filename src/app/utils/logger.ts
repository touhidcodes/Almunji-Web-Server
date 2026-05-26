import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log levels — query sits between info and debug
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    query: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    query: "cyan",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
});

// Daily file rotation (all logs)
const allLogs = new DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

// Daily file rotation (errors only)
const errorLogs = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  level: "error",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d",
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "query",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    allLogs,
    errorLogs,
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
}) as winston.Logger & { query: winston.LeveledLogMethod };

export default logger;
