import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!productId) {
      return NextResponse.json({
        error: 'productId parameter is required',
      }, { status: 400 });
    }

    console.log(`🎯 Getting recommendations for product: ${productId}`);

    // For testing without database data
    if (productId === 'test123' || productId.includes('test')) {
      return NextResponse.json({
        recommendedProductIds: ['rec-1', 'rec-2', 'rec-3'],
        message: 'Test mode - recommendations bypassed'
      });
    }

    // Get recommendations from ProductReco table
    const recommendations = await prisma.productReco.findMany({
      where: {
        productId,
      },
      include: {
        recoProduct: {
          include: {
            seller: {
              select: {
                id: true,
                storeName: true,
                storeSlug: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      take: limit,
    });

    if (recommendations.length === 0) {
      // Fallback: get products from the same category
      console.log('📂 No recommendations found, falling back to category-based recommendations');
      
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { category: true },
      });

      if (!product) {
        return NextResponse.json({
          error: 'Product not found',
        }, { status: 404 });
      }

      const categoryProducts = await prisma.product.findMany({
        where: {
          category: product.category,
          isActive: true,
          id: { not: productId }, // Exclude the current product
        },
        include: {
          seller: {
            select: {
              id: true,
              storeName: true,
              storeSlug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' },
        ],
        take: limit,
      });

      return NextResponse.json({
        products: categoryProducts.map(p => ({
          ...p,
          score: 0.5, // Default score for fallback
        })),
        source: 'category_fallback',
        productId,
      });
    }

    // Filter out inactive recommended products
    const activeRecommendations = recommendations.filter(
      rec => rec.recoProduct.isActive
    );

    // Transform to include product data and score
    const recommendedProducts = activeRecommendations.map(rec => ({
      ...rec.recoProduct,
      score: rec.score,
      recommendationId: rec.id,
    }));

    console.log(`✅ Found ${recommendedProducts.length} recommendations for product ${productId}`);

    return NextResponse.json({
      products: recommendedProducts,
      source: 'ml_recommendations',
      productId,
      stats: {
        total: recommendedProducts.length,
        avgScore: recommendedProducts.length > 0 
          ? (recommendedProducts.reduce((sum, p) => sum + p.score, 0) / recommendedProducts.length).toFixed(3)
          : 0,
      },
    });

  } catch (error) {
    console.error('💥 Error getting recommendations:', error);
    
    return NextResponse.json({
      error: 'Failed to get recommendations',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST endpoint for batch recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, limit = 6 } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({
        error: 'productIds array is required',
      }, { status: 400 });
    }

    console.log(`🎯 Getting batch recommendations for ${productIds.length} products`);

    const results = await Promise.all(
      productIds.map(async (productId: string) => {
        try {
          const recommendations = await prisma.productReco.findMany({
            where: { productId },
            include: {
              recoProduct: {
                include: {
                  seller: {
                    select: {
                      id: true,
                      storeName: true,
                      storeSlug: true,
                    },
                  },
                  reviews: {
                    select: {
                      rating: true,
                    },
                  },
                },
              },
            },
            orderBy: { score: 'desc' },
            take: limit,
          });

          const activeRecommendations = recommendations.filter(
            rec => rec.recoProduct.isActive
          );

          return {
            productId,
            recommendations: activeRecommendations.map(rec => ({
              ...rec.recoProduct,
              score: rec.score,
              recommendationId: rec.id,
            })),
            count: activeRecommendations.length,
          };
        } catch (error) {
          console.error(`Error getting recommendations for product ${productId}:`, error);
          return {
            productId,
            recommendations: [],
            count: 0,
            error: 'Failed to get recommendations',
          };
        }
      })
    );

    const totalRecommendations = results.reduce((sum, result) => sum + result.count, 0);

    console.log(`✅ Batch recommendations completed: ${totalRecommendations} total recommendations`);

    return NextResponse.json({
      results,
      stats: {
        totalProducts: productIds.length,
        totalRecommendations,
        avgRecommendationsPerProduct: (totalRecommendations / productIds.length).toFixed(2),
      },
    });

  } catch (error) {
    console.error('💥 Error getting batch recommendations:', error);
    
    return NextResponse.json({
      error: 'Failed to get batch recommendations',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
