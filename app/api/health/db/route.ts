/**
 * Database Health Check Endpoint
 * 
 * Google Cloud SQL bağlantı durumunu kontrol eder
 * GET /api/health/db
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { checkDatabaseConnection, getCloudSQLConnectionInfo } from '@/lib/prisma';

export async function GET() {
  try {
    // Connection test
    const connectionStatus = await checkDatabaseConnection();
    
    // Connection info
    const connectionInfo = await getCloudSQLConnectionInfo();

    return NextResponse.json({
      status: connectionStatus.success ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: connectionInfo,
      message: connectionStatus.message,
    }, {
      status: connectionStatus.success ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 500
    });
  }
}

