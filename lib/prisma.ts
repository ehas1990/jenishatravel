import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  isDbOffline?: boolean;
  lastDbCheck?: number;
};

// Initialize Prisma Client with clean logging to prevent engine-level stdout console spam
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Cache database connection state globally to survive Next.js dev hot-reloads
if (globalForPrisma.isDbOffline === undefined) {
  globalForPrisma.isDbOffline = false;
  globalForPrisma.lastDbCheck = 0;
}

/**
 * Checks if the database is available. Uses a cached status to avoid connection
 * timeouts and console spam when the database is offline.
 */
export async function isDbAvailable(): Promise<boolean> {
  const now = Date.now();
  
  // If we checked recently (within last 15 seconds), return the cached status
  if (now - (globalForPrisma.lastDbCheck ?? 0) < 15000) {
    return !globalForPrisma.isDbOffline;
  }

  globalForPrisma.lastDbCheck = now;
  try {
    // Run a minimal query with a quick timeout check
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))
    ]);
    
    if (globalForPrisma.isDbOffline) {
      console.log("[Prisma] Database connection re-established.");
      globalForPrisma.isDbOffline = false;
    }
    return true;
  } catch (error) {
    if (!globalForPrisma.isDbOffline) {
      // Log exactly one clean error when the connection first fails
      console.warn("[Prisma] Database connection failed (localhost:5432). Entering offline fallback mode.");
      globalForPrisma.isDbOffline = true;
    }
    return false;
  }
}
