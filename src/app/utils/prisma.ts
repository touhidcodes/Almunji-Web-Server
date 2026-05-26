import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import logger from "@/utils/logger";
import "dotenv/config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// DB Adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 10,
});

// Single Prisma Client instance (singleton in dev)
const prismaBase =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [
      { level: "error", emit: "event" },
      { level: "warn", emit: "event" },
      { level: "info", emit: "event" },
    ],
  });

// Attach Winston logging for Prisma built-in events
(prismaBase as any).$on?.("error", (e: any) => {
  logger.error(`[Prisma] ${e.message}`, { target: e.target });
});

(prismaBase as any).$on?.("warn", (e: any) => {
  logger.warn(`[Prisma] ${e.message}`, { target: e.target });
});

(prismaBase as any).$on?.("info", (e: any) => {
  logger.info(`[Prisma] ${e.message}`, { target: e.target });
});

// Extend with middleware to log CREATE / UPDATE / DELETE operations
const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = Date.now();
        const result = await query(args);
        const duration = Date.now() - start;

        // Log write operations with row counts
        if (
          operation === "create" ||
          operation === "createMany" ||
          operation === "update" ||
          operation === "updateMany" ||
          operation === "delete" ||
          operation === "deleteMany" ||
          operation === "upsert"
        ) {
          let count = 1;
          if (
            result &&
            typeof result === "object" &&
            "count" in (result as object)
          ) {
            count = (result as { count: number }).count;
          }

          const actionMap: Record<string, string> = {
            create: "CREATED",
            createMany: "CREATED",
            update: "UPDATED",
            updateMany: "UPDATED",
            delete: "DELETED",
            deleteMany: "DELETED",
            upsert: "UPSERTED",
          };

          logger.info(
            `[DB] ${actionMap[operation]} ${count} row(s) in [${model}] — ${duration}ms`
          );
        }

        return result;
      },
    },
  },
}) as unknown as PrismaClient;

// Prevent multiple instances in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaBase;
}

export default prisma;
