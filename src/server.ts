import { Server } from "http";
import app from "./app";
import config from "./app/config/config";
import logger from "./app/utils/logger";
import prisma from "./app/utils/prisma";

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
  }
}

main();

// Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
  logger.error("uncaughtException:", error);
  process.exit(1);
});

// Handle Unhandled Rejections
process.on("unhandledRejection", (error) => {
  logger.error("unhandledRejection:", error);
  if (server) {
    server.close(() => {
      logger.info("Server closed due to unhandled rejection");
      prisma.$disconnect().then(() => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM (Graceful Shutdown)
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      logger.info("Server closed.");
      prisma.$disconnect();
    });
  }
});
