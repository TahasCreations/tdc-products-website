import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCouponSchema = z.object({
  code: z.string().min(3).max(50),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  discountValue: z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  usageLimitPerUser: z.number().int().positive().default(1),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  applicableTo: z.enum(['all', 'specific_products', 'specific_categories']).optional(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  firstTimeOnly: z.boolean().default(false),
});

/**
 * GET /api/seller/coupons
 * Satıcıya ait kuponları listeler
 */
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      sellerId: sellerProfile.id,
    };

    if (status === 'active') {
      where.isActive = true;
      where.OR = [
        { validUntil: null },
        { validUntil: { gte: new Date() } },
      ];
    } else if (status === 'expired') {
      where.validUntil = { lt: new Date() };
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: {
          _count: {
            select: { usages: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      coupons: coupons.map(coupon => ({
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
        createdAt: coupon.createdAt.toISOString(),
        updatedAt: coupon.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Satıcı kuponları getirme hatası:', error);
    return NextResponse.json(
      {
        error: "Kuponlar getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seller/coupons
 * Satıcı yeni kupon oluşturur
 */
export async function POST(req: Request) {
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
    const validatedData = createCouponSchema.parse(body);

    // Kupon kodu benzersiz olmalı
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code.toUpperCase() },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Bu kupon kodu zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Kuponu oluştur
    const coupon = await prisma.coupon.create({
      data: {
        code: validatedData.code.toUpperCase(),
        name: validatedData.name,
        description: validatedData.description,
        sellerId: sellerProfile.id,
        type: validatedData.type,
        discountValue: validatedData.discountValue,
        minOrderAmount: validatedData.minOrderAmount,
        maxDiscountAmount: validatedData.maxDiscountAmount,
        usageLimit: validatedData.usageLimit,
        usageLimitPerUser: validatedData.usageLimitPerUser,
        validFrom: validatedData.validFrom ? new Date(validatedData.validFrom) : new Date(),
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : null,
        isActive: true,
        applicableTo: validatedData.applicableTo || 'all',
        productIds: validatedData.productIds ? JSON.stringify(validatedData.productIds) : null,
        categoryIds: validatedData.categoryIds ? JSON.stringify(validatedData.categoryIds) : null,
        firstTimeOnly: validatedData.firstTimeOnly,
      },
    });

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        discountValue: coupon.discountValue,
        isActive: coupon.isActive,
        validFrom: coupon.validFrom.toISOString(),
        validUntil: coupon.validUntil?.toISOString(),
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Kupon oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Kupon oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

