import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';

import { prisma } from '@/lib/prisma';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return createUnauthorizedResponse();
    }

    const asset = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const response = {
      ...asset,
      tags: JSON.parse(asset.tags),
      usedIn: JSON.parse(asset.usedIn)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Media asset detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    }
}

