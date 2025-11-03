import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get store data by slug
 * Custom domain'lerde kullanılır
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { storeSlug: string } }
) {
  try {
    const storeSlug = params.storeSlug;

    // Find seller by slug
    const seller = await prisma.sellerProfile.findUnique({
      where: { 
        storeSlug: storeSlug.toLowerCase()
      },
      include: {
        products: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            listPrice: true,
            images: true,
            rating: true,
            reviewCount: true,
            stock: true
          },
          take: 50 // İlk 50 ürün
        },
        theme: true
      }
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }

    // Check seller status
    if (seller.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Store not active' },
        { status: 403 }
      );
    }

    // Parse images from JSON string
    const products = seller.products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images as string) : []
    }));

    return NextResponse.json({
      success: true,
      seller: {
        id: seller.id,
        storeSlug: seller.storeSlug,
        storeName: seller.storeName,
        description: seller.description,
        logoUrl: seller.logoUrl,
        rating: seller.rating,
        reviewCount: seller.reviewCount
      },
      products,
      theme: seller.theme
    });

  } catch (error) {
    console.error('Error fetching store data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

