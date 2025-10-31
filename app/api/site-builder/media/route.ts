import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// GET: List media assets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get('folder') || 'all';
    const type = searchParams.get('type') || 'all';

    const where: any = {};
    if (folder !== 'all') where.folder = folder;
    if (type !== 'all') where.type = type;

    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON fields
    const formattedAssets = assets.map(asset => ({
      ...asset,
      tags: typeof asset.tags === 'string' ? JSON.parse(asset.tags) : asset.tags,
    }));

    return NextResponse.json({ success: true, assets: formattedAssets });
  } catch (error) {
    console.error('Error fetching media assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets', assets: [] },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

