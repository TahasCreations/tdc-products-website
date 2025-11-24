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
  usageLimit: z.number().int().positive().nullable().optional(),
  usageLimitPerUser: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().nullable().optional(),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  customerRestrictions: z.record(z.any()).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const coupon = await prisma.coupon.findUnique({
      where: { id: params.id },
      include: {
        usages: {
          include: {
            user: { select: { name: true, email: true } },
            order: { select: { orderNumber: true, total: true } },
          },
          orderBy: { usedAt: 'desc' },
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
        isPublic: coupon.isPublic,
        validFrom: coupon.validFrom.toISOString(),
        validUntil: coupon.validUntil?.toISOString(),
        applicableProducts: coupon.applicableProducts ? JSON.parse(coupon.applicableProducts) : [],
        applicableCategories: coupon.applicableCategories ? JSON.parse(coupon.applicableCategories) : [],
        excludedProducts: coupon.excludedProducts ? JSON.parse(coupon.excludedProducts) : [],
        customerRestrictions: coupon.customerRestrictions,
        usages: coupon.usages.map(usage => ({
          id: usage.id,
          orderNumber: usage.order.orderNumber,
          customerName: usage.user.name,
          customerEmail: usage.user.email,
          discountAmount: usage.discountAmount,
          orderTotal: usage.orderTotal,
          usedAt: usage.usedAt.toISOString(),
        })),
        createdAt: coupon.createdAt.toISOString(),
        updatedAt: coupon.updatedAt.toISOString(),
      },
    });

  } catch (error) {
    console.error('Kupon detay hatası:', error);
    return NextResponse.json(
      {
        error: "Kupon detayı alınamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const body = await req.json();
    const validatedData = updateCouponSchema.parse(body);

    const updateData: any = {};
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.discountValue !== undefined) updateData.discountValue = validatedData.discountValue;
    if (validatedData.minOrderAmount !== undefined) updateData.minOrderAmount = validatedData.minOrderAmount;
    if (validatedData.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = validatedData.maxDiscountAmount;
    if (validatedData.usageLimit !== undefined) updateData.usageLimit = validatedData.usageLimit;
    if (validatedData.usageLimitPerUser !== undefined) updateData.usageLimitPerUser = validatedData.usageLimitPerUser;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    if (validatedData.isPublic !== undefined) updateData.isPublic = validatedData.isPublic;
    if (validatedData.validFrom !== undefined) updateData.validFrom = new Date(validatedData.validFrom);
    if (validatedData.validUntil !== undefined) updateData.validUntil = validatedData.validUntil ? new Date(validatedData.validUntil) : null;
    if (validatedData.applicableProducts !== undefined) updateData.applicableProducts = JSON.stringify(validatedData.applicableProducts);
    if (validatedData.applicableCategories !== undefined) updateData.applicableCategories = JSON.stringify(validatedData.applicableCategories);
    if (validatedData.excludedProducts !== undefined) updateData.excludedProducts = JSON.stringify(validatedData.excludedProducts);
    if (validatedData.customerRestrictions !== undefined) updateData.customerRestrictions = validatedData.customerRestrictions;

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        isActive: coupon.isActive,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    await prisma.coupon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Kupon silindi",
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



