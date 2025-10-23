import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';
import { checkRateLimit, getRateLimitConfig } from '@/lib/media/rate-limit';
import { UpdateAltTextSchema } from '@/lib/media/validation';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return createUnauthorizedResponse();
    }

    // Check rate limit
    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkRateLimit(request, {
      ...rateLimitConfig.write,
      keyPrefix: 'media:write'
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validated = UpdateAltTextSchema.parse(body);

    // Get existing asset
    const existing = await prisma.mediaAsset.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Update asset
    const updated = await prisma.mediaAsset.update({
      where: { id: params.id },
      data: {
        alt: validated.alt,
        title: validated.title || existing.title
      }
    });

    // Create history record
    await prisma.mediaHistory.create({
      data: {
        assetId: params.id,
        action: 'update',
        performedBy: admin.email,
        oldValue: {
          alt: existing.alt,
          title: existing.title
        },
        newValue: {
          alt: validated.alt,
          title: validated.title
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        tags: JSON.parse(updated.tags),
        usedIn: JSON.parse(updated.usedIn)
      }
    });

  } catch (error) {
    console.error('Update alt text error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

