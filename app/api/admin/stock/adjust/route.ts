import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateStock } from "@/lib/stock/stock-manager";
import { z } from "zod";

const adjustStockSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int(),
  reason: z.string().optional(),
  notes: z.string().optional(),
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

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = adjustStockSchema.parse(body);

    // Determine type based on quantity
    const type = validatedData.quantity > 0 ? 'increase' : 'decrease';

    const result = await updateStock({
      productId: validatedData.productId,
      variantId: validatedData.variantId,
      quantity: validatedData.quantity,
      type: 'adjustment',
      reason: validatedData.reason || 'Manual stock adjustment',
      referenceType: 'adjustment',
      notes: validatedData.notes,
      createdBy: user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      previousStock: result.previousStock,
      newStock: result.newStock,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Stok ayarlama hatası:', error);
    return NextResponse.json(
      {
        error: "Stok ayarlanamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



