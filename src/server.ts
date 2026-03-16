import { Server } from "http";
import app from "./app";
import config from "./app/config/config";
import prisma from "./app/utils/prisma";

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

main();

// Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
  console.error("uncaughtException:", error);
  process.exit(1);
});

// Handle Unhandled Rejections
process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection:", error);
  if (server) {
    server.close(() => {
      console.log("Server closed due to unhandled rejection");
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
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      prisma.$disconnect();
    });
  }
});
