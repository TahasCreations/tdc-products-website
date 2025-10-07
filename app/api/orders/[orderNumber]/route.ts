import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await getServerSession(authOptions as any);
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

    // Siparişi getir
    const order = await prisma.order.findFirst({
      where: { 
        orderNumber: params.orderNumber,
        userId: user.id 
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                image: true,
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        items: order.items
      }
    });

  } catch (error) {
    console.error('Sipariş getirilirken hata:', error);
    return NextResponse.json({ 
      error: "Sipariş getirilemedi",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
