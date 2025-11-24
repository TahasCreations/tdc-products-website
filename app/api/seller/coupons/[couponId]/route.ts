import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCouponSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed', 'free_shipping']).optional(),
  discountValue: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  usageLimitPerUser: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  applicableTo: z.enum(['all', 'specific_products', 'specific_categories']).optional(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  firstTimeOnly: z.boolean().optional(),
});

/**
 * GET /api/seller/coupons/[couponId]
 * Belirli bir kuponun detaylarını getirir
 */
export async function GET(
  req: Request,
  { params }: { params: { couponId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        id: params.couponId,
        sellerId: sellerProfile.id,
      },
      include: {
        usages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            order: {
              select: {
                id: true,
                orderNumber: true,
                total: true,
                createdAt: true,
              },
            },
          },
          orderBy: { usedAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        usageLimit: coupon.usageLimit,
        usageLimitPerUser: coupon.usageLimitPerUser,
        usedCount: coupon._count.usages,
        isActive: coupon.isActive,
        validFrom: coupon.validFrom.toISOString(),
        validUntil: coupon.validUntil?.toISOString(),
        applicableTo: coupon.applicableTo,
        productIds: coupon.productIds ? JSON.parse(coupon.productIds) : [],
        categoryIds: coupon.categoryIds ? JSON.parse(coupon.categoryIds) : [],
        firstTimeOnly: coupon.firstTimeOnly,
        recentUsages: coupon.usages.map(usage => ({
          id: usage.id,
          user: usage.user,
          order: usage.order,
          discountAmount: usage.discountAmount,
          usedAt: usage.usedAt.toISOString(),
        })),
        createdAt: coupon.createdAt.toISOString(),
        updatedAt: coupon.updatedAt.toISOString(),
      },
    });

  } catch (error) {
    console.error('Kupon detayı getirme hatası:', error);
    return NextResponse.json(
      {
        error: "Kupon getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/seller/coupons/[couponId]
 * Kuponu günceller
 */
export async function PATCH(
  req: Request,
  { params }: { params: { couponId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = updateCouponSchema.parse(body);

    // Kuponu kontrol et
    const coupon = await prisma.coupon.findFirst({
      where: {
        id: params.couponId,
        sellerId: sellerProfile.id,
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.discountValue !== undefined) updateData.discountValue = validatedData.discountValue;
    if (validatedData.minOrderAmount !== undefined) updateData.minOrderAmount = validatedData.minOrderAmount;
    if (validatedData.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = validatedData.maxDiscountAmount;
    if (validatedData.usageLimit !== undefined) updateData.usageLimit = validatedData.usageLimit;
    if (validatedData.usageLimitPerUser !== undefined) updateData.usageLimitPerUser = validatedData.usageLimitPerUser;
    if (validatedData.validFrom !== undefined) updateData.validFrom = new Date(validatedData.validFrom);
    if (validatedData.validUntil !== undefined) updateData.validUntil = validatedData.validUntil ? new Date(validatedData.validUntil) : null;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    if (validatedData.applicableTo !== undefined) updateData.applicableTo = validatedData.applicableTo;
    if (validatedData.productIds !== undefined) updateData.productIds = validatedData.productIds ? JSON.stringify(validatedData.productIds) : null;
    if (validatedData.categoryIds !== undefined) updateData.categoryIds = validatedData.categoryIds ? JSON.stringify(validatedData.categoryIds) : null;
    if (validatedData.firstTimeOnly !== undefined) updateData.firstTimeOnly = validatedData.firstTimeOnly;

    // Kuponu güncelle
    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.couponId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      coupon: {
        id: updatedCoupon.id,
        code: updatedCoupon.code,
        name: updatedCoupon.name,
        type: updatedCoupon.type,
        discountValue: updatedCoupon.discountValue,
        isActive: updatedCoupon.isActive,
        validFrom: updatedCoupon.validFrom.toISOString(),
        validUntil: updatedCoupon.validUntil?.toISOString(),
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Kupon güncelleme hatası:', error);
    return NextResponse.json(
      {
        error: "Kupon güncellenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seller/coupons/[couponId]
 * Kuponu siler (soft delete - isActive: false)
 */
export async function DELETE(
  req: Request,
  { params }: { params: { couponId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    // Kuponu kontrol et
    const coupon = await prisma.coupon.findFirst({
      where: {
        id: params.couponId,
        sellerId: sellerProfile.id,
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
    }

    // Soft delete - isActive: false yap
    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.couponId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Kupon silindi",
      coupon: {
        id: updatedCoupon.id,
        code: updatedCoupon.code,
        isActive: updatedCoupon.isActive,
      },
    });

  } catch (error) {
    console.error('Kupon silme hatası:', error);
    return NextResponse.json(
      {
        error: "Kupon silinemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

