import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';
import { checkRateLimit, getRateLimitConfig } from '@/lib/media/rate-limit';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAX_UPLOAD_SIZE = parseInt(process.env.MEDIA_MAX_UPLOAD_MB || '20', 10) * 1024 * 1024;

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

    // Parse multipart form data
    const formData = await request.formData();
    const assetId = formData.get('assetId') as string;
    const file = formData.get('file') as File;
    const keepOriginal = formData.get('keepOriginal') === 'true';

    if (!assetId || !file) {
      return NextResponse.json(
        { error: 'Missing required fields: assetId and file' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${process.env.MEDIA_MAX_UPLOAD_MB || 20}MB` },
        { status: 413 }
      );
    }

    // Get existing asset
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Only allow replacing local images
    if (asset.storage !== 'LOCAL') {
      return NextResponse.json(
        { error: 'Can only replace local images' },
        { status: 400 }
      );
    }

    const targetPath = path.join(PUBLIC_DIR, asset.path || asset.url);

    // Backup original if requested
    if (keepOriginal && fs.existsSync(targetPath)) {
      const backupDir = path.join(path.dirname(targetPath), '.backup');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const backupPath = path.join(backupDir, `${path.basename(targetPath)}.${timestamp}`);
      fs.copyFileSync(targetPath, backupPath);
    }

    // Write new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(targetPath, buffer);

    // Get new metadata
    let width: number | null = null;
    let height: number | null = null;
    let dominantColor: string | null = null;

    try {
      const metadata = await sharp(targetPath).metadata();
      width = metadata.width || null;
      height = metadata.height || null;

      const { dominant } = await sharp(targetPath).stats();
      if (dominant) {
        dominantColor = `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`;
      }
    } catch (error) {
      // Not a processable image
    }

    const stats = fs.statSync(targetPath);

    // Update asset
    const updated = await prisma.mediaAsset.update({
      where: { id: assetId },
      data: {
        width,
        height,
        sizeBytes: stats.size,
        dominantColor,
        updatedAt: new Date()
      }
    });

    // Create history record
    await prisma.mediaHistory.create({
      data: {
        assetId: asset.id,
        action: 'replace',
        performedBy: admin.email,
        oldValue: {
          width: asset.width,
          height: asset.height,
          sizeBytes: asset.sizeBytes,
          dominantColor: asset.dominantColor
        },
        newValue: {
          width,
          height,
          sizeBytes: stats.size,
          dominantColor
        },
        metadata: {
          keepOriginal,
          filename: file.name
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Image replaced successfully',
      data: {
        ...updated,
        tags: JSON.parse(updated.tags),
        usedIn: JSON.parse(updated.usedIn)
      }
    });

  } catch (error) {
    console.error('Replace error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

