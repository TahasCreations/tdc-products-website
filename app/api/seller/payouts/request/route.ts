import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSellerFinancialSnapshot } from "@/lib/seller-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  amount: z.coerce.number().positive("Tutar pozitif olmalıdır.").optional(),
  iban: z.string().max(34).optional(),
  note: z.string().max(250).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string } | undefined;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Geçersiz talep", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const financials = await getSellerFinancialSnapshot(sellerProfile.id);
    const available = financials.availableBalance;

    if (available <= 0) {
      return NextResponse.json(
        { success: false, error: "Ödeme isteği oluşturmak için kullanılabilir bakiyeniz yok." },
        { status: 400 },
      );
    }

    const amount = parsed.data.amount ?? available;

    if (amount > available + 0.01) {
      return NextResponse.json(
        {
          success: false,
          error: `Talep edilen tutar (₺${amount.toFixed(
            2,
          )}) kullanılabilir bakiyeden (₺${available.toFixed(2)}) büyük olamaz.`,
        },
        { status: 400 },
      );
    }

    const payout = await prisma.payout.create({
      data: {
        sellerId: sellerProfile.id,
        amount,
        currency: "TRY",
        status: "scheduled",
        meta: {
          requestedBySeller: true,
          iban: parsed.data.iban ?? sellerProfile.iban ?? undefined,
          note: parsed.data.note ?? undefined,
        },
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        meta: true,
        createdAt: true,
        processedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: payout.id,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        meta: payout.meta,
        createdAt: payout.createdAt.toISOString(),
        processedAt: payout.processedAt ? payout.processedAt.toISOString() : null,
      },
    });
  } catch (error) {
    console.error("Seller payout request error:", error);
    return NextResponse.json(
      { success: false, error: "Ödeme isteği oluşturulamadı." },
      { status: 500 },
    );
  }
}




