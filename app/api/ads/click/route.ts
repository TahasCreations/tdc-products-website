export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { shouldRateLimitClick } from "@/src/lib/ads";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { campaignId, productId, cost, idempotencyKey } = await req.json();
  if (!campaignId || !productId || !cost) return new Response("bad_request",{status:400});
  
  // IP rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (shouldRateLimitClick(campaignId, ip)) {
    return new Response("rate_limited", { status: 429 });
  }
  
  // Idempotency kontrolü
  if (idempotencyKey) {
    const existingClick = await prisma.adClick.findFirst({
      where: { 
        campaignId, 
        productId,
        meta: { path: ['idempotencyKey'], equals: idempotencyKey }
      }
    });
    if (existingClick) {
      return Response.json({ ok: true, message: "already_processed" });
    }
  }
  
  // Kampanya bilgilerini al
  const campaign = await prisma.adCampaign.findUnique({
    where: { id: campaignId },
    select: { cpcMax: true, dailyBudget: true, spentToday: true, sellerId: true }
  });
  
  if (!campaign) return new Response("campaign_not_found", { status: 404 });
  
  // Bütçe ve teklif kontrolü
  const remaining = Number(campaign.dailyBudget) - Number(campaign.spentToday);
  const maxCpc = Math.min(Number(campaign.cpcMax), remaining);
  
  if (cost > maxCpc) {
    return new Response("budget_exceeded", { status: 409 });
  }
  
  // Atomik işlem
  const result = await prisma.$transaction(async (tx) => {
    const updatedCampaign = await tx.adCampaign.update({
      where: { id: campaignId },
      data: { spentToday: { increment: cost } },
      select: { spentToday: true }
    });
    
    await tx.adClick.create({ 
      data: { 
        campaignId, 
        productId, 
        cost,
        ip,
        ua: req.headers.get('user-agent'),
        meta: idempotencyKey ? { idempotencyKey } : {}
      } 
    });
    
    // Ledger
    await tx.ledgerEntry.create({
      data: { 
        sellerId: campaign.sellerId, 
        type: "AD_SPEND", 
        amount: cost, 
        currency: "TRY", 
        meta: { campaignId, productId, idempotencyKey } 
      }
    });
    
    return {
      spentToday: updatedCampaign.spentToday,
      remaining: Number(campaign.dailyBudget) - Number(updatedCampaign.spentToday)
    };
  });
  
  return Response.json({ 
    ok: true, 
    spentToday: result.spentToday,
    remaining: result.remaining
  });
}
