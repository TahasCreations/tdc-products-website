import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateReturnSchema = z.object({
  status: z.enum(['approved', 'rejected', 'processing', 'completed', 'cancelled']).optional(),
  refundAmount: z.number().optional(),
  refundMethod: z.enum(['original', 'store_credit', 'bank_transfer']).optional(),
  returnTrackingCode: z.string().optional(),
  returnCarrier: z.string().optional(),
  adminNotes: z.string().optional(),
});

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: params.returnId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    title: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
        orderItem: {
          include: {
            product: {
              select: {
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

    // Kullanıcı kendi iadesini veya admin tüm iadeleri görebilir
    if (returnRequest.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Bu iade talebine erişim yetkiniz yok" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      returnRequest: {
        id: returnRequest.id,
        orderNumber: returnRequest.order.orderNumber,
        orderItem: returnRequest.orderItem ? {
          productTitle: returnRequest.orderItem.product?.title,
          quantity: returnRequest.orderItem.qty,
          price: returnRequest.orderItem.unitPrice,
        } : null,
        reason: returnRequest.reason,
        reasonCategory: returnRequest.reasonCategory,
        description: returnRequest.description,
        status: returnRequest.status,
        refundAmount: returnRequest.refundAmount,
        refundMethod: returnRequest.refundMethod,
        returnTrackingCode: returnRequest.returnTrackingCode,
        returnCarrier: returnRequest.returnCarrier,
        adminNotes: returnRequest.adminNotes,
        images: returnRequest.images ? JSON.parse(returnRequest.images) : null,
        createdAt: returnRequest.createdAt,
        processedAt: returnRequest.processedAt,
        completedAt: returnRequest.completedAt,
      },
    });

  } catch (error) {
    console.error('İade talebi getirme hatası:', error);
    return NextResponse.json(
      {
        error: "İade talebi getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sadece admin iade durumunu güncelleyebilir
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateReturnSchema.parse(body);

    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: params.returnId },
      include: {
        order: true,
      },
    });

    if (!returnRequest) {
      return NextResponse.json({ error: "İade talebi bulunamadı" }, { status: 404 });
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {};
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.refundAmount !== undefined) updateData.refundAmount = validatedData.refundAmount;
    if (validatedData.refundMethod) updateData.refundMethod = validatedData.refundMethod;
    if (validatedData.returnTrackingCode) updateData.returnTrackingCode = validatedData.returnTrackingCode;
    if (validatedData.returnCarrier) updateData.returnCarrier = validatedData.returnCarrier;
    if (validatedData.adminNotes) updateData.adminNotes = validatedData.adminNotes;

    // Durum değişikliklerinde tarihleri güncelle
    if (validatedData.status === 'processing' && !returnRequest.processedAt) {
      updateData.processedAt = new Date();
    }
    if (validatedData.status === 'completed' && !returnRequest.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedReturn = await prisma.returnRequest.update({
      where: { id: params.returnId },
      data: updateData,
      include: {
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
    });

    // Process refund if approved
    if (validatedData.status === 'approved' && returnRequest.status !== 'approved') {
      const { processRefund } = await import("@/lib/returns/refund-processor");
      
      const refundAmount = validatedData.refundAmount || returnRequest.order.total;
      const refundMethod = validatedData.refundMethod || 'original';
      
      const refundResult = await processRefund({
        returnRequestId: params.returnId,
        refundAmount,
        refundMethod,
        orderId: returnRequest.order.id,
        paymentRef: returnRequest.order.paymentRef || undefined,
      });

      if (!refundResult.success) {
        console.error("Refund processing errors:", refundResult.errors);
        // Don't fail the update, but log errors
      }
    }

    // Complete refund if status changed to completed
    if (validatedData.status === 'completed' && returnRequest.status !== 'completed') {
      const { completeRefund } = await import("@/lib/returns/refund-processor");
      await completeRefund(params.returnId);
      
      // Update stock if item is returned
      if (returnRequest.orderItemId) {
        const orderItem = await prisma.orderItem.findUnique({
          where: { id: returnRequest.orderItemId },
          include: { product: true },
        });
        
        if (orderItem) {
          await prisma.product.update({
            where: { id: orderItem.productId },
            data: {
              stock: orderItem.product.stock + orderItem.qty,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      returnRequest: updatedReturn,
      message: "İade talebi güncellendi",
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

