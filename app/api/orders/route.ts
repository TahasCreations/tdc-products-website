import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    quantity: z.number(),
    sellerId: z.string(),
    sellerName: z.string(),
  })),
  customerInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
  total: z.number(),
  paymentMethod: z.enum(['credit', 'bank', 'cash']),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sipariş numarası oluştur
    const orderNumber = `TDC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'pending',
        total: validatedData.total,
        shippingAddress: validatedData.shippingAddress,
        customerInfo: validatedData.customerInfo,
        paymentMethod: validatedData.paymentMethod,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            sellerId: item.sellerId,
            sellerName: item.sellerName,
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('Sipariş oluşturulurken hata:', error);
    return NextResponse.json({ 
      error: "Sipariş oluşturulamadı",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
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

    // Kullanıcının siparişlerini getir
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Siparişler getirilirken hata:', error);
    return NextResponse.json({ 
      error: "Siparişler getirilemedi",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
