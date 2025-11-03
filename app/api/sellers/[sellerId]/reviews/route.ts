import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - Satıcı değerlendirmelerini getir
export async function GET(
  req: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    const sellerId = params.sellerId;
    
    // Query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, helpful, rating
    
    const skip = (page - 1) * limit;
    
    // Sort config
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'helpful') {
      orderBy = { isHelpful: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    }
    
    // Get reviews
    const [reviews, total, seller] = await Promise.all([
      prisma.sellerReview.findMany({
        where: { sellerId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.sellerReview.count({ where: { sellerId } }),
      prisma.sellerProfile.findUnique({
        where: { id: sellerId },
        select: {
          storeName: true,
          rating: true,
          reviewCount: true,
          totalSales: true
        }
      })
    ]);
    
    // Calculate rating distribution
    const ratingDistribution = await prisma.sellerReview.groupBy({
      by: ['rating'],
      where: { sellerId },
      _count: { rating: true }
    });
    
    const distributionMap = ratingDistribution.reduce((acc, item) => {
      acc[item.rating] = item._count.rating;
      return acc;
    }, {} as Record<number, number>);
    
    // Calculate average ratings for criteria
    const avgRatings = await prisma.sellerReview.aggregate({
      where: { sellerId },
      _avg: {
        communicationRating: true,
        shippingSpeedRating: true,
        productQualityRating: true
      }
    });
    
    return NextResponse.json({
      success: true,
      reviews: reviews.map(review => ({
        ...review,
        pros: review.pros ? JSON.parse(review.pros) : [],
        cons: review.cons ? JSON.parse(review.cons) : []
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      seller,
      stats: {
        ratingDistribution: distributionMap,
        averageRatings: {
          communication: avgRatings._avg.communicationRating || 0,
          shippingSpeed: avgRatings._avg.shippingSpeedRating || 0,
          productQuality: avgRatings._avg.productQualityRating || 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Yeni satıcı değerlendirmesi ekle
export async function POST(
  req: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const sellerId = params.sellerId;
    const body = await req.json();
    
    const {
      orderId,
      rating,
      communicationRating,
      shippingSpeedRating,
      productQualityRating,
      title,
      comment,
      pros,
      cons
    } = body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid rating' },
        { status: 400 }
      );
    }
    
    // Check if seller exists
    const seller = await prisma.sellerProfile.findUnique({
      where: { id: sellerId }
    });
    
    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller not found' },
        { status: 404 }
      );
    }
    
    // Check if user has already reviewed this seller for this order
    if (orderId) {
      const existingReview = await prisma.sellerReview.findFirst({
        where: {
          userId: session.user.id,
          sellerId,
          orderId
        }
      });
      
      if (existingReview) {
        return NextResponse.json(
          { success: false, error: 'You have already reviewed this seller for this order' },
          { status: 400 }
        );
      }
    }
    
    // Verify purchase if orderId provided
    let isVerified = false;
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  sellerId: true
                }
              }
            }
          }
        }
      });
      
      // Check if order has products from this seller
      if (order && order.items.some(item => item.product.sellerId === sellerId)) {
        isVerified = true;
      }
    }
    
    // Create review
    const review = await prisma.sellerReview.create({
      data: {
        userId: session.user.id,
        sellerId,
        orderId: orderId || null,
        rating,
        communicationRating: communicationRating || null,
        shippingSpeedRating: shippingSpeedRating || null,
        productQualityRating: productQualityRating || null,
        title: title || null,
        comment: comment || null,
        pros: pros ? JSON.stringify(pros) : null,
        cons: cons ? JSON.stringify(cons) : null,
        isVerified
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    // Update seller rating
    await updateSellerRating(sellerId);
    
    return NextResponse.json({
      success: true,
      review: {
        ...review,
        pros: review.pros ? JSON.parse(review.pros) : [],
        cons: review.cons ? JSON.parse(review.cons) : []
      }
    });
    
  } catch (error) {
    console.error('Error creating seller review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to update seller rating
async function updateSellerRating(sellerId: string) {
  const stats = await prisma.sellerReview.aggregate({
    where: { sellerId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  
  await prisma.sellerProfile.update({
    where: { id: sellerId },
    data: {
      rating: stats._avg.rating || 0,
      reviewCount: stats._count.rating
    }
  });
}

