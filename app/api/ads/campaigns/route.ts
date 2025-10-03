export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireEntitlement } from "@/lib/guards";

export async function POST(req: NextRequest) {
  const user = await requireRole("SELLER", "ADMIN");
  await requireEntitlement("ads");
  
  const { name, dailyBudget, cpcMax, keywords, targets } = await req.json();
  
  // Validasyon
  if (!name || !dailyBudget || !cpcMax || !keywords?.length || !targets?.length) {
    return new Response("bad_request", { status: 400 });
  }
  
  if (Number(dailyBudget) < Number(cpcMax)) {
    return new Response("daily_budget_must_be_greater_than_cpc", { status: 400 });
  }
  
  // Seller ID
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });
  
  // Kampanya oluştur
  const campaign = await prisma.$transaction(async (tx) => {
    const newCampaign = await tx.adCampaign.create({
      data: {
        sellerId: seller.id,
        name,
        dailyBudget: Number(dailyBudget),
        cpcMax: Number(cpcMax),
        keywords: keywords.split(',').map((k: string) => k.trim()),
        status: "DRAFT"
      }
    });
    
    // Hedef ürünleri ekle
    await tx.adTarget.createMany({
      data: targets.map((productId: string) => ({
        campaignId: newCampaign.id,
        productId,
        weight: 1
      }))
    });
    
    return newCampaign;
  });
  
  return Response.json({ ok: true, campaign });
}

export async function GET(req: NextRequest) {
  const user = await requireRole("SELLER", "ADMIN");
  
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });
  
  const campaigns = await prisma.adCampaign.findMany({
    where: { sellerId: seller.id },
    include: {
      adTargets: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json({ campaigns });
}
