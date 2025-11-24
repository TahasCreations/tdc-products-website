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
  minOrderAmount: z.number().min(0).default(0),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  usageLimitPerUser: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  customerRestrictions: z.record(z.any()).optional(),
});

const updateCouponSchema = createCouponSchema.partial().extend({
  code: z.string().min(3).max(50).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    
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

    const coupons = await prisma.coupon.findMany({
      where,
      include: {
        usages: {
          select: {
            id: true,
            usedAt: true,
            discountAmount: true,
          },
          orderBy: { usedAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { usages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

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
        isPublic: coupon.isPublic,
        validFrom: coupon.validFrom.toISOString(),
        validUntil: coupon.validUntil?.toISOString(),
        applicableProducts: coupon.applicableProducts ? JSON.parse(coupon.applicableProducts) : [],
        applicableCategories: coupon.applicableCategories ? JSON.parse(coupon.applicableCategories) : [],
        excludedProducts: coupon.excludedProducts ? JSON.parse(coupon.excludedProducts) : [],
        customerRestrictions: coupon.customerRestrictions,
        recentUsages: coupon.usages,
        createdAt: coupon.createdAt.toISOString(),
        updatedAt: coupon.updatedAt.toISOString(),
      })),
    });

  } catch (error) {
    console.error('Kupon listeleme hatası:', error);
    return NextResponse.json(
      {
        error: "Kuponlar listelenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
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

    const coupon = await prisma.coupon.create({
      data: {
        code: validatedData.code.toUpperCase(),
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        discountValue: validatedData.discountValue,
        minOrderAmount: validatedData.minOrderAmount,
        maxDiscountAmount: validatedData.maxDiscountAmount,
        usageLimit: validatedData.usageLimit,
        usageLimitPerUser: validatedData.usageLimitPerUser,
        isActive: validatedData.isActive,
        isPublic: validatedData.isPublic,
        validFrom: validatedData.validFrom ? new Date(validatedData.validFrom) : new Date(),
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : null,
        applicableProducts: validatedData.applicableProducts ? JSON.stringify(validatedData.applicableProducts) : null,
        applicableCategories: validatedData.applicableCategories ? JSON.stringify(validatedData.applicableCategories) : null,
        excludedProducts: validatedData.excludedProducts ? JSON.stringify(validatedData.excludedProducts) : null,
        customerRestrictions: validatedData.customerRestrictions || null,
        createdBy: user.id,
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



