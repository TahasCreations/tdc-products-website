import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MediaStatus } from '@prisma/client';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';
import { checkRateLimit, getRateLimitConfig } from '@/lib/media/rate-limit';
import { BulkUpdateSchema } from '@/lib/media/validation';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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
    const validated = BulkUpdateSchema.parse(body);

    let updateCount = 0;

    switch (validated.action) {
      case 'updateAlt': {
        const { alt, title } = validated.data;
        await prisma.mediaAsset.updateMany({
          where: { id: { in: validated.assetIds } },
          data: { alt, title }
        });
        updateCount = validated.assetIds.length;
        break;
      }

      case 'addTags': {
        const { tags } = validated.data;
        for (const assetId of validated.assetIds) {
          const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
          if (asset) {
            const currentTags = JSON.parse(asset.tags);
            const newTags = [...new Set([...currentTags, ...tags])];
            await prisma.mediaAsset.update({
              where: { id: assetId },
              data: { tags: JSON.stringify(newTags) }
            });
            updateCount++;
          }
        }
        break;
      }

      case 'removeTags': {
        const { tags } = validated.data;
        for (const assetId of validated.assetIds) {
          const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
          if (asset) {
            const currentTags = JSON.parse(asset.tags);
            const newTags = currentTags.filter((t: string) => !tags.includes(t));
            await prisma.mediaAsset.update({
              where: { id: assetId },
              data: { tags: JSON.stringify(newTags) }
            });
            updateCount++;
          }
        }
        break;
      }

      case 'updateStatus': {
        const { status } = validated.data;
        await prisma.mediaAsset.updateMany({
          where: { id: { in: validated.assetIds } },
          data: { status: status as MediaStatus }
        });
        updateCount = validated.assetIds.length;
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Create bulk history record
    await prisma.mediaHistory.create({
      data: {
        assetId: validated.assetIds[0], // Link to first asset
        action: validated.action,
        performedBy: admin.email,
        metadata: {
          bulkOperation: true,
          assetIds: validated.assetIds,
          data: validated.data
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${updateCount} assets`,
      updatedCount: updateCount
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

