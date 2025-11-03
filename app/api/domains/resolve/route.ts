import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Domain Resolution API
 * Middleware tarafından custom domain'leri çözmek için kullanılır
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const hostname = searchParams.get('hostname');
    
    if (!hostname) {
      return NextResponse.json(
        { success: false, error: 'Hostname required' },
        { status: 400 }
      );
    }

    // Find domain in database
    const storeDomain = await prisma.storeDomain.findUnique({
      where: { 
        hostname: hostname.toLowerCase()
      },
      include: {
        seller: {
          select: {
            id: true,
            storeSlug: true,
            storeName: true,
            description: true,
            logoUrl: true,
            rating: true,
            reviewCount: true,
            status: true,
            theme: true
          }
        }
      }
    });

    // Domain must exist and be verified
    if (!storeDomain || storeDomain.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Domain not found or not verified' },
        { status: 404 }
      );
    }

    // Seller must be active
    if (storeDomain.seller.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Seller not active' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      domain: {
        id: storeDomain.id,
        hostname: storeDomain.hostname,
        status: storeDomain.status,
        verifiedAt: storeDomain.verifiedAt
      },
      seller: {
        id: storeDomain.seller.id,
        storeSlug: storeDomain.seller.storeSlug,
        storeName: storeDomain.seller.storeName,
        description: storeDomain.seller.description,
        logoUrl: storeDomain.seller.logoUrl,
        rating: storeDomain.seller.rating,
        reviewCount: storeDomain.seller.reviewCount,
        theme: storeDomain.seller.theme
      }
    });

  } catch (error) {
    console.error('Domain resolution error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

