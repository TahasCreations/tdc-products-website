import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendLowStockAlert } from "@/src/lib/email";

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
    const alertType = searchParams.get('type');
    const isResolved = searchParams.get('resolved') === 'true';

    const where: any = {};
    if (alertType) where.alertType = alertType;
    if (isResolved !== null) where.isResolved = isResolved;

    const alerts = await prisma.stockAlert.findMany({
      where,
      include: {
        product: {
          select: {
            title: true,
            slug: true,
            stock: true,
            seller: {
              select: {
                displayName: true,
                email: true,
              },
            },
          },
        },
        variant: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      alerts: alerts.map(alert => ({
        id: alert.id,
        productId: alert.productId,
        variantId: alert.variantId,
        product: alert.product,
        variant: alert.variant,
        alertType: alert.alertType,
        currentStock: alert.currentStock,
        threshold: alert.threshold,
        isResolved: alert.isResolved,
        notifiedAt: alert.notifiedAt?.toISOString(),
        resolvedAt: alert.resolvedAt?.toISOString(),
        createdAt: alert.createdAt.toISOString(),
      })),
    });

  } catch (error) {
    console.error('Stok uyarıları hatası:', error);
    return NextResponse.json(
      {
        error: "Stok uyarıları alınamadı",
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
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const { alertId, action } = await req.json();

    if (action === 'notify') {
      // Send email notification for low stock
      const alert = await prisma.stockAlert.findUnique({
        where: { id: alertId },
        include: {
          product: {
            include: {
              seller: {
                select: {
                  email: true,
                  displayName: true,
                },
              },
            },
          },
        },
      });

      if (alert && alert.product.seller) {
        try {
          await sendLowStockAlert({
            sellerEmail: alert.product.seller.email,
            sellerName: alert.product.seller.displayName,
            productName: alert.product.title,
            currentStock: alert.currentStock,
            threshold: alert.threshold,
          });

          await prisma.stockAlert.update({
            where: { id: alertId },
            data: { notifiedAt: new Date() },
          });
        } catch (emailError) {
          console.error('Email gönderme hatası:', emailError);
        }
      }
    } else if (action === 'resolve') {
      await prisma.stockAlert.update({
        where: { id: alertId },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Stok uyarı işleme hatası:', error);
    return NextResponse.json(
      {
        error: "İşlem gerçekleştirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



