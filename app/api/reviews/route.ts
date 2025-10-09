import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReviewSchema = z.object({
  productId: z.string().min(1),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'newest';

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID gerekli" }, { status: 400 });
    }

    // Filtreleme kriterleri
    const where: any = {
      productId,
      isReported: false, // Şikayet edilen yorumları gizle
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    // Sıralama kriterleri
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'helpful') {
      orderBy = { isHelpful: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const skip = (page - 1) * limit;

    const [reviews, total, product] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          likes: {
            select: {
              userId: true,
              isLike: true,
            }
          },
          _count: {
            select: {
              likes: true,
            }
          }
        }
      }),
      prisma.review.count({ where }),
      prisma.product.findUnique({
        where: { id: productId },
        select: {
          title: true,
          rating: true,
          reviewCount: true,
        }
      })
    ]);

    // Rating dağılımını hesapla
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId, isReported: false },
      _count: {
        rating: true,
      }
    });

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      product,
      ratingDistribution: ratingDistribution.reduce((acc, item) => {
        acc[item.rating] = item._count.rating;
        return acc;
      }, {} as Record<number, number>),
    });

  } catch (error) {
    console.error('Değerlendirmeler getirilirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createReviewSchema.parse(body);

    // Ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      select: { id: true, title: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Kullanıcının daha önce değerlendirme yapıp yapmadığını kontrol et
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId,
        }
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: "Bu ürün için zaten değerlendirme yaptınız" }, { status: 400 });
    }

    // Sipariş doğrulaması (opsiyonel)
    let isVerified = false;
    if (validatedData.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: validatedData.orderId,
          userId: user.id,
          status: 'delivered',
          items: {
            some: {
              productId: validatedData.productId,
            }
          }
        }
      });
      isVerified = !!order;
    }

    // Değerlendirmeyi oluştur
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: validatedData.productId,
        orderId: validatedData.orderId,
        rating: validatedData.rating,
        title: validatedData.title,
        comment: validatedData.comment,
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
        pros: validatedData.pros ? JSON.stringify(validatedData.pros) : null,
        cons: validatedData.cons ? JSON.stringify(validatedData.cons) : null,
        isVerified,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    // Ürünün ortalama rating'ini güncelle
    await updateProductRating(validatedData.productId);

    return NextResponse.json({
      success: true,
      review,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('Değerlendirme oluşturulurken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Ürünün ortalama rating'ini güncelle
async function updateProductRating(productId: string) {
  try {
    const stats = await prisma.review.aggregate({
      where: {
        productId,
        isReported: false,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating || 0,
      }
    });
  } catch (error) {
    console.error('Ürün rating güncellenirken hata:', error);
  }
}
