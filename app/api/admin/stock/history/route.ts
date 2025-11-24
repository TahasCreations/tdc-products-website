import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;
    if (type) where.type = type;

    const history = await prisma.stockHistory.findMany({
      where,
      include: {
        product: {
          select: {
            title: true,
            slug: true,
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
      take: limit,
    });

    return NextResponse.json({
      success: true,
      history: history.map(item => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        product: item.product,
        variant: item.variant,
        type: item.type,
        quantity: item.quantity,
        previousStock: item.previousStock,
        newStock: item.newStock,
        reason: item.reason,
        referenceId: item.referenceId,
        referenceType: item.referenceType,
        notes: item.notes,
        createdAt: item.createdAt.toISOString(),
      })),
    });

  } catch (error) {
    console.error('Stok geçmişi hatası:', error);
    return NextResponse.json(
      {
        error: "Stok geçmişi alınamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



