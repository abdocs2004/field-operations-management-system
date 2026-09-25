import { PrismaClient } from "@prisma/client";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

// Prevent hot-reload from creating a new PrismaClient (and new connection
// pool) on every file change during development.
export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: env.isProduction ? ["error", "warn"] : ["error", "warn"],
  });

if (!env.isProduction) {
  global.__prisma__ = prisma;
}
