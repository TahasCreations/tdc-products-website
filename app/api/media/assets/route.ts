import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MediaStatus, MediaStorage } from '@prisma/client';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/media/auth';
import { checkRateLimit, getRateLimitConfig } from '@/lib/media/rate-limit';
import { MediaFilterSchema } from '@/lib/media/validation';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return createUnauthorizedResponse();
    }

    // Check rate limit
    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkRateLimit(request, {
      ...rateLimitConfig.read,
      keyPrefix: 'media:read'
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitConfig.read.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString()
          }
        }
      );
    }

    // Parse query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    
    // Convert string params to proper types
    const queryParams = {
      ...searchParams,
      hasAlt: searchParams.hasAlt === 'true' ? true : searchParams.hasAlt === 'false' ? false : undefined,
      minSize: searchParams.minSize ? parseInt(searchParams.minSize, 10) : undefined,
      maxSize: searchParams.maxSize ? parseInt(searchParams.maxSize, 10) : undefined,
      page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit, 10) : 20
    };

    const validated = MediaFilterSchema.parse(queryParams);

    // Build where clause
    const where: any = {};

    if (validated.format) {
      where.format = validated.format;
    }

    if (validated.status) {
      where.status = validated.status as MediaStatus;
    }

    if (validated.storage) {
      where.storage = validated.storage as MediaStorage;
    }

    if (validated.hasAlt !== undefined) {
      where.alt = validated.hasAlt ? { not: null } : null;
    }

    if (validated.search) {
      where.OR = [
        { filename: { contains: validated.search, mode: 'insensitive' } },
        { url: { contains: validated.search, mode: 'insensitive' } },
        { alt: { contains: validated.search, mode: 'insensitive' } }
      ];
    }

    if (validated.minSize || validated.maxSize) {
      where.sizeBytes = {};
      if (validated.minSize) where.sizeBytes.gte = validated.minSize;
      if (validated.maxSize) where.sizeBytes.lte = validated.maxSize;
    }

    // Get total count
    const total = await prisma.mediaAsset.count({ where });

    // Get paginated results
    const skip = (validated.page - 1) * validated.limit;
    const assets = await prisma.mediaAsset.findMany({
      where,
      skip,
      take: validated.limit,
      orderBy: { lastIndexedAt: 'desc' },
      select: {
        id: true,
        url: true,
        storage: true,
        filename: true,
        width: true,
        height: true,
        format: true,
        sizeBytes: true,
        dominantColor: true,
        alt: true,
        title: true,
        tags: true,
        status: true,
        usedIn: true,
        lastIndexedAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Parse JSON fields
    const parsedAssets = assets.map(asset => ({
      ...asset,
      tags: JSON.parse(asset.tags),
      usedIn: JSON.parse(asset.usedIn)
    }));

    return NextResponse.json({
      data: parsedAssets,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        totalPages: Math.ceil(total / validated.limit)
      }
    });

  } catch (error) {
    console.error('Media assets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

