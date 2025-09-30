import { PrismaClient } from '@prisma/client';
import { env } from '@tdc/config';

// Global variable to store Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client with proper configuration
export const prisma = globalThis.__prisma || new PrismaClient({
  log: env.isDevelopment() ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: env.getDatabaseUrl(),
    },
  },
});

// In development, store the client globally to prevent multiple instances
if (env.isDevelopment()) {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;

