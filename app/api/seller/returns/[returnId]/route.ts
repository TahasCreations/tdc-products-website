import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateReturnStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled']),
  adminNotes: z.string().optional(),
});

/**
 * GET /api/seller/returns/[returnId]
 * Belirli bir iade talebinin detaylarını getirir
 */
export async function GET(
  req: Request,
  { params }: { params: { returnId: string } }
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

    const returnRequest = await prisma.returnRequest.findFirst({
      where: {
        id: params.returnId,
        sellerId: sellerProfile.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            createdAt: true,
            shippingAddress: true,
          },
        },
        orderItem: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!returnRequest) {
      return NextResponse.json({ error: "İade talebi bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      returnRequest: {
        id: returnRequest.id,
        orderNumber: returnRequest.order.orderNumber,
        customer: {
          id: returnRequest.user.id,
          name: returnRequest.user.name,
          email: returnRequest.user.email,
          phone: returnRequest.user.phone,
        },
        product: returnRequest.orderItem ? {
          id: returnRequest.orderItem.productId,
          title: returnRequest.orderItem.product?.title || returnRequest.orderItem.title,
          quantity: returnRequest.orderItem.qty,
          price: returnRequest.orderItem.unitPrice,
          subtotal: returnRequest.orderItem.subtotal,
          image: returnRequest.orderItem.product?.images 
            ? (JSON.parse(returnRequest.orderItem.product.images as string)?.[0] || null)
            : null,
        } : null,
        reason: returnRequest.reason,
        description: returnRequest.description,
        status: returnRequest.status,
        refundAmount: returnRequest.refundAmount,
        refundMethod: returnRequest.refundMethod,
        trackingNumber: returnRequest.trackingNumber,
        images: returnRequest.images ? JSON.parse(returnRequest.images) : [],
        adminNotes: returnRequest.adminNotes,
        shippingAddress: returnRequest.order.shippingAddress,
        createdAt: returnRequest.createdAt,
        processedAt: returnRequest.processedAt,
      },
    });

  } catch (error) {
    console.error('İade talebi detayı getirme hatası:', error);
    return NextResponse.json(
      {
        error: "İade talebi getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/seller/returns/[returnId]
 * Satıcı iade talebi durumunu günceller (sadece onaylama/reddetme)
 */
export async function PATCH(
  req: Request,
  { params }: { params: { returnId: string } }
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
    const validatedData = updateReturnStatusSchema.parse(body);

    // İade talebini kontrol et
    const returnRequest = await prisma.returnRequest.findFirst({
      where: {
        id: params.returnId,
        sellerId: sellerProfile.id,
      },
      include: {
        orderItem: true,
      },
    });

    if (!returnRequest) {
      return NextResponse.json({ error: "İade talebi bulunamadı" }, { status: 404 });
    }

    // Satıcı sadece pending durumundaki talepleri onaylayabilir/reddedebilir
    if (returnRequest.status !== 'pending') {
      return NextResponse.json(
        { error: "Sadece bekleyen iade talepleri güncellenebilir" },
        { status: 400 }
      );
    }

    // Satıcı sadece approved veya rejected yapabilir
    if (!['approved', 'rejected'].includes(validatedData.status)) {
      return NextResponse.json(
        { error: "Satıcı sadece onaylama veya reddetme yapabilir" },
        { status: 400 }
      );
    }

    // İade talebini güncelle
    const updatedReturn = await prisma.returnRequest.update({
      where: { id: params.returnId },
      data: {
        status: validatedData.status,
        adminNotes: validatedData.adminNotes,
        processedBy: user.id,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      returnRequest: {
        id: updatedReturn.id,
        status: updatedReturn.status,
        message: validatedData.status === 'approved' 
          ? "İade talebi onaylandı" 
          : "İade talebi reddedildi",
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('İade talebi güncelleme hatası:', error);
    return NextResponse.json(
      {
        error: "İade talebi güncellenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

