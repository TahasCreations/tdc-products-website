import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List all folders
export async function GET(request: NextRequest) {
  try {
    const assets = await prisma.mediaAsset.findMany({
      select: { folder: true },
      distinct: ['folder'],
    });

    const folders = assets
      .map(a => a.folder)
      .filter(Boolean)
      .filter((f): f is string => f !== null);

    return NextResponse.json({
      success: true,
      folders: ['Uncategorized', ...folders],
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch folders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Folder name required' },
        { status: 400 }
      );
    }

    // Just return success - folders are created when files are uploaded to them
    return NextResponse.json({
      success: true,
      folder: name.trim(),
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create folder' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

