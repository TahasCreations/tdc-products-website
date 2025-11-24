import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReturnSchema = z.object({
  orderId: z.string(),
  orderItemId: z.string().optional(),
  reason: z.string().min(10, "İade sebebi en az 10 karakter olmalıdır"),
  reasonCategory: z.enum([
    'product_defect', // Ürün hatası
    'wrong_product', // Yanlış ürün
    'not_as_described', // Açıklamaya uygun değil
    'damaged', // Hasarlı
    'size_issue', // Beden sorunu
    'color_issue', // Renk sorunu
    'changed_mind', // Fikrim değişti
    'other', // Diğer
  ]),
  description: z.string().optional(),
  images: z.array(z.string()).optional(), // Base64 encoded images
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createReturnSchema.parse(body);

    // Siparişi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Bu sipariş size ait değil" }, { status: 403 });
    }

    // Sipariş durumunu kontrol et (sadece paid veya shipped durumunda iade yapılabilir)
    if (!['paid', 'shipped', 'delivered'].includes(order.status)) {
      return NextResponse.json(
        { error: "Bu sipariş için iade yapılamaz" },
        { status: 400 }
      );
    }

    // 14 günlük cayma hakkı kontrolü
    const orderDate = new Date(order.createdAt);
    const daysSinceOrder = Math.floor(
      (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceOrder > 14) {
      return NextResponse.json(
        { error: "14 günlük cayma hakkı süresi dolmuş" },
        { status: 400 }
      );
    }

    // Daha önce iade talebi var mı kontrol et
    const existingReturn = await prisma.returnRequest.findFirst({
      where: {
        orderId: validatedData.orderId,
        orderItemId: validatedData.orderItemId || null,
        status: {
          in: ['pending', 'approved', 'processing'],
        },
      },
    });

    if (existingReturn) {
      return NextResponse.json(
        { error: "Bu ürün için zaten bir iade talebi mevcut" },
        { status: 400 }
      );
    }

    // OrderItem'dan sellerId'yi al
    let sellerId: string | null = null;
    if (validatedData.orderItemId) {
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: validatedData.orderItemId },
        select: { sellerId: true },
      });
      sellerId = orderItem?.sellerId || null;
    }

    // İade talebi oluştur
    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId: validatedData.orderId,
        orderItemId: validatedData.orderItemId,
        userId: user.id,
        sellerId: sellerId,
        reason: validatedData.reason,
        reasonCategory: validatedData.reasonCategory,
        description: validatedData.description,
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
        status: 'pending',
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      returnRequest: {
        id: returnRequest.id,
        orderNumber: returnRequest.order.orderNumber,
        status: returnRequest.status,
        message: "İade talebiniz alındı. En kısa sürede değerlendirilecektir.",
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('İade talebi oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "İade talebi oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    // Kullanıcının iade taleplerini getir
    const returnRequests = await prisma.returnRequest.findMany({
      where: {
        userId: user.id,
        ...(orderId && { orderId }),
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            createdAt: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      returnRequests: returnRequests.map((rr) => ({
        id: rr.id,
        orderNumber: rr.order.orderNumber,
        orderItem: rr.orderItem ? {
          productTitle: rr.orderItem.product?.title,
          quantity: rr.orderItem.qty,
          price: rr.orderItem.unitPrice,
        } : null,
        reason: rr.reason,
        reasonCategory: rr.reasonCategory,
        status: rr.status,
        refundAmount: rr.refundAmount,
        returnTrackingCode: rr.returnTrackingCode,
        createdAt: rr.createdAt,
        processedAt: rr.processedAt,
        completedAt: rr.completedAt,
      })),
    });

  } catch (error) {
    console.error('İade talepleri getirme hatası:', error);
    return NextResponse.json(
      {
        error: "İade talepleri getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



