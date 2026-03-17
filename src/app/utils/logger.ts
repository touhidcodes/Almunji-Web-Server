import fs from "fs";
import path from "path";
import winston from "winston";

// Create logs directory if it doesn't exist
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
  level: "info",
  format: format,
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logDir, "combined.log"),
    }),
    // Write all error logs to error.log
    new winston.transports.File({ 
      filename: path.join(logDir, "error.log"), 
      level: "error" 
    }),
  ],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
