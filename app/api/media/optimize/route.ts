import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';
import { checkRateLimit, getRateLimitConfig } from '@/lib/media/rate-limit';
import { OptimizeImageSchema } from '@/lib/media/validation';
import { optimizeImage } from '@/lib/media/optimizer';
import * as path from 'path';

import { prisma } from '@/lib/prisma';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

export async function POST(request: NextRequest) {
  try {
    // Check if optimization is enabled
    if (process.env.ENABLE_IMAGE_OPTIMIZATION !== 'true') {
      return NextResponse.json(
        { error: 'Image optimization is not enabled. Set ENABLE_IMAGE_OPTIMIZATION=true' },
        { status: 403 }
      );
    }

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
    const validated = OptimizeImageSchema.parse(body);

    // Get assets
    const assets = await prisma.mediaAsset.findMany({
      where: {
        id: { in: validated.assetIds },
        storage: 'LOCAL' // Only optimize local images
      }
    });

    if (assets.length === 0) {
      return NextResponse.json(
        { error: 'No local images found with provided IDs' },
        { status: 404 }
      );
    }

    // Optimize each asset
    const results = [];

    for (const asset of assets) {
      const sourcePath = path.join(PUBLIC_DIR, asset.path || asset.url);
      
      const result = await optimizeImage(sourcePath, {
        format: validated.format,
        quality: validated.quality,
        keepOriginal: true
      });

      if (result.success && result.optimizedPath) {
        // Create history record
        await prisma.mediaHistory.create({
          data: {
            assetId: asset.id,
            action: 'optimize',
            performedBy: admin.email,
            metadata: {
              format: validated.format,
              quality: validated.quality,
              originalSize: result.originalSize,
              optimizedSize: result.optimizedSize,
              savingsPercent: result.savingsPercent
            }
          }
        });
      }

      results.push({
        assetId: asset.id,
        filename: asset.filename,
        ...result
      });
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Optimized ${successCount} of ${results.length} images`,
      results
    });

  } catch (error) {
    console.error('Optimize error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    }
}

