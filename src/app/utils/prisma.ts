import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import logger from "@/utils/logger";
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// MariaDB Adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 10,
});

// Prisma Base Client
const prismaBase =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,

    log: [
      { level: "error", emit: "event" },
      { level: "warn", emit: "event" },
    ],
  });

const getPrismaErrorMessage = (error: any) => {
  if (error?.message?.includes("Argument `where` is missing")) {
    return 'Missing required "where" argument';
  }

  if (error?.code === "P2025") {
    return "Record not found";
  }

  if (error?.code === "P2002") {
    return "Duplicate record";
  }

  return "Database operation failed";
};

(prismaBase as any).$on?.("error", (e: any) => {
  logger.error(`[DB ERROR] ${e.message}`);
});

(prismaBase as any).$on?.("warn", (e: any) => {
  logger.warn(`[DB WARN] ${e.message}`);
});

const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, query }) {
        const start = Date.now();

        try {
          const result = await query({});
          const duration = Date.now() - start;

          if (
            operation === "create" ||
            operation === "createMany" ||
            operation === "update" ||
            operation === "updateMany" ||
            operation === "delete" ||
            operation === "deleteMany" ||
            operation === "upsert" ||
            operation === "findUnique" ||
            operation === "findFirst"
          ) {
            logger.info(
              `[DB] ${operation.toUpperCase()} on ${model} (${duration}ms)`
            );
          }

          return result;
        } catch (error: any) {
          const duration = Date.now() - start;
          const cleanMessage = getPrismaErrorMessage(error);

          logger.error(
            `[DB ERROR] ${operation.toUpperCase()} on ${model} failed (${duration}ms) | ${cleanMessage}`
          );

          throw error;
        }
      },
    },
  },
}) as unknown as PrismaClient;

// GLOBAL SINGLETON
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaBase;
}

// PROCESS ERROR HANDLING
process.on("unhandledRejection", (reason: any) => {
  logger.error(`[UNHANDLED REJECTION] ${reason}`);
});

process.on("uncaughtException", (error: Error) => {
  logger.error(`[UNCAUGHT EXCEPTION] ${error.message}`);
});

export default prisma;
