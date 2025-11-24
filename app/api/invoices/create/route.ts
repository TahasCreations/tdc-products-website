import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eFaturaAdapter, EInvoiceData } from "@/lib/invoice/efatura-adapter";
import { z } from "zod";

const createInvoiceSchema = z.object({
  orderId: z.string(),
  invoiceType: z.enum(['E_FATURA', 'E_ARSIV']).default('E_ARSIV'),
});

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sadece admin veya satıcı fatura oluşturabilir
    if (user.role !== 'ADMIN' && user.role !== 'SELLER') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = createInvoiceSchema.parse(body);

    // Siparişi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Sadece ödenmiş siparişler için fatura oluşturulabilir
    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: "Sadece ödenmiş siparişler için fatura oluşturulabilir" },
        { status: 400 }
      );
    }

    // Satıcı bilgilerini getir
    const firstItem = order.items[0];
    if (!firstItem) {
      return NextResponse.json({ error: "Siparişte ürün bulunamadı" }, { status: 400 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { id: firstItem.sellerId },
      select: { taxNumber: true, storeName: true },
    });

    if (!seller || !seller.taxNumber) {
      return NextResponse.json(
        { error: "Satıcı VKN bulunamadı. E-Fatura için VKN gereklidir." },
        { status: 400 }
      );
    }

    // Fatura verilerini hazırla
    const invoiceData: EInvoiceData = {
      invoiceNumber: `EF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      invoiceDate: new Date(),
      sellerTaxNumber: seller.taxNumber,
      buyerName: order.user?.name || 'Müşteri',
      buyerAddress: (order.shippingAddress as any)?.address || '',
      buyerCity: (order.shippingAddress as any)?.city || '',
      buyerPostalCode: (order.shippingAddress as any)?.postalCode || '',
      items: order.items.map((item) => {
        const unitPrice = item.unitPrice;
        const quantity = item.qty;
        const total = item.subtotal;
        const kdvRate = 18; // %18 KDV
        const kdvAmount = total * (kdvRate / 100);
        const subtotal = total - kdvAmount;

        return {
          name: item.product?.title || item.title,
          quantity,
          unitPrice,
          kdvRate,
          kdvAmount,
          total,
        };
      }),
      subtotal: order.items.reduce((sum, item) => {
        const kdvAmount = item.subtotal * 0.18;
        return sum + (item.subtotal - kdvAmount);
      }, 0),
      totalKDV: order.items.reduce((sum, item) => sum + (item.subtotal * 0.18), 0),
      total: order.total,
      currency: order.currency,
    };

    // E-Fatura oluştur
    const result = await eFaturaAdapter.createInvoice(invoiceData);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Fatura oluşturulamadı",
          details: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice: {
        invoiceNumber: result.invoiceNumber,
        invoiceUUID: result.invoiceUUID,
        pdfUrl: result.pdfUrl,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Fatura oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Fatura oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



