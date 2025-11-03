import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Get user's gift registries
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In production: Fetch from database
    const registries = [];

    return NextResponse.json({
      success: true,
      registries
    });

  } catch (error) {
    console.error('Gift registry list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registries' },
      { status: 500 }
    );
  }
}

