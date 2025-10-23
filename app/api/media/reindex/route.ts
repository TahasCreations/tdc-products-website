import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return createUnauthorizedResponse();
    }

    // Trigger reindex in background
    // Note: In production, this should be a queue job
    const isWindows = process.platform === 'win32';
    const command = isWindows
      ? 'npm run media:index'
      : 'pnpm media:index';

    // Run in background (fire and forget)
    execAsync(command).catch(err => {
      console.error('Reindex error:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Reindexing started in background. Check logs for progress.'
    });

  } catch (error) {
    console.error('Reindex trigger error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

