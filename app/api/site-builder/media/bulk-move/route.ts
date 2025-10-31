import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetIds, folder } = body;

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Asset IDs required' },
        { status: 400 }
      );
    }

    await prisma.mediaAsset.updateMany({
      where: { id: { in: assetIds } },
      data: { folder: folder || 'Uncategorized' },
    });

    return NextResponse.json({
      success: true,
      moved: assetIds.length,
    });
  } catch (error) {
    console.error('Error bulk moving assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to move assets' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

