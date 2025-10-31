import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetIds } = body;

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Asset IDs required' },
        { status: 400 }
      );
    }

    // Get assets to delete
    const assets = await prisma.mediaAsset.findMany({
      where: { id: { in: assetIds } },
    });

    // Delete physical files
    for (const asset of assets) {
      try {
        if (asset.url.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), 'public', asset.url);
          await unlink(filePath);
        }
      } catch (error) {
        console.error(`Error deleting file ${asset.url}:`, error);
      }
    }

    // Delete from database
    await prisma.mediaAsset.deleteMany({
      where: { id: { in: assetIds } },
    });

    return NextResponse.json({
      success: true,
      deleted: assetIds.length,
    });
  } catch (error) {
    console.error('Error bulk deleting assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete assets' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

