import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import logger from "@/utils/logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// DB Adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 5,
});

// Prisma Client (singleton)
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Prevent multiple instances in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Use Prisma built-in log stream instead
const prismaWithLogging = new PrismaClient({
  adapter,
  log: [
    { level: "query", emit: "stdout" },
    { level: "error", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
  ],
});

// Attach safe logging (only supported events)
(prismaWithLogging as any).$on?.("query", (e: any) => {
  logger.query(e.message);
});

(prismaWithLogging as any).$on?.("error", (e: any) => {
  logger.error(e.message);
});

(prismaWithLogging as any).$on?.("warn", (e: any) => {
  logger.warn(e.message);
});

(prismaWithLogging as any).$on?.("info", (e: any) => {
  logger.info(e.message);
});

export default prisma;
