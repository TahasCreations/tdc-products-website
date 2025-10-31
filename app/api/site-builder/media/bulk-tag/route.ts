import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetIds, tags } = body;

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Asset IDs required' },
        { status: 400 }
      );
    }

    // Get existing assets
    const assets = await prisma.mediaAsset.findMany({
      where: { id: { in: assetIds } },
    });

    // Update each asset with merged tags
    for (const asset of assets) {
      const existingTags = typeof asset.tags === 'string' ? JSON.parse(asset.tags) : asset.tags || [];
      const newTags = Array.from(new Set([...existingTags, ...tags]));
      
      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: { tags: JSON.stringify(newTags) },
      });
    }

    return NextResponse.json({
      success: true,
      tagged: assetIds.length,
    });
  } catch (error) {
    console.error('Error bulk tagging assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to tag assets' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

