export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { PrismaClient, Plan } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PLANS_MAP as PLANS } from "@/lib/billing";
const prisma = new PrismaClient();

const DEMO_MODE = process.env.DEMO_BILLING !== "false"; // default true

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  const { sku } = await req.json(); // "MONTHLY_800" | "YEARLY_500_DOMAIN"
  if (!sku || !(sku in PLANS)) return new Response("bad_request", { status: 400 });

  const plan = PLANS[sku as keyof typeof PLANS];
  // SellerProfile
  const sp = await prisma.sellerProfile.findUnique({ where: { userId: (session.user as any).id }, select: { id: true }});
  if (!sp) return new Response("seller_profile_required", { status: 400 });

  if (DEMO_MODE) {
    // ÖDEME YOK: anında etkinleştir (webhook simülasyonu)
    const now = new Date();
    const end = new Date(now);
    if (plan.billingCycle === "MONTHLY") end.setMonth(end.getMonth() + 1);
    else end.setMonth(end.getMonth() + (plan.commitmentMonths ?? 12));

    const sub = await prisma.subscription.create({
      data: {
        sellerId: sp.id,
        plan: plan.plan as Plan,
        status: "active",
        billingCycle: plan.billingCycle as any,
        price: plan.priceTRY,
        currency: "TRY",
        periodStart: now,
        periodEnd: end,
        // meta: { sku },
      },
    });

    // Domain hakkı: yıllık + includesDomain
    if (plan.includesDomain) {
      await prisma.domainAllowance.create({
        data: { sellerId: sp.id, years: 1, grantedBySubId: sub.id }
      });
    }

    // Basit fatura kaydı
    await prisma.invoice.create({
      data: {
        sellerId: sp.id,
        periodStart: now,
        periodEnd: end,
        total: plan.priceTRY,
        pdfUrl: null,
      }
    });

    return Response.json({ checkoutUrl: "/(dashboard)/seller/billing/success" });
  }

  // REAL PSP: burada ödeme sağlayıcına oturum oluştur (iyzico/PayTR/Stripe)
  // dönen redirect url'i checkoutUrl olarak cevapla:
  // return Response.json({ checkoutUrl });
  return new Response("psp_not_configured", { status: 501 });
}
