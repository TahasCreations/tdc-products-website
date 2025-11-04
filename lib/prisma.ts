/**
 * Prisma Client Singleton
 * 
 * Google Cloud SQL için optimize edilmiş connection pooling
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const isGoogleCloudSQL = process.env.DATABASE_URL?.includes('postgresql://');

  return new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
      },
    },
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Connection health check
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    return { success: true, message: 'Database connected' };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  } finally {
    // Don't disconnect in serverless environment
    if (process.env.VERCEL !== '1') {
      await prisma.$disconnect();
    }
  }
}

// Google Cloud SQL için özel bağlantı yönetimi
export async function getCloudSQLConnectionInfo() {
  if (!process.env.DATABASE_URL?.includes('postgresql://')) {
    return { provider: 'SQLite', url: 'file:./dev.db' };
  }

  try {
    const url = new URL(process.env.DATABASE_URL);
    return {
      provider: 'Google Cloud SQL PostgreSQL',
      host: url.hostname,
      port: url.port,
      database: url.pathname.substring(1),
      ssl: url.searchParams.get('sslmode') || 'disabled',
      connectionLimit: url.searchParams.get('connection_limit') || 'default',
    };
  } catch (error) {
    return { provider: 'Unknown', error: 'Invalid DATABASE_URL' };
  }
}
