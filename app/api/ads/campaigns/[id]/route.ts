export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireEntitlement } from "@/lib/guards";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireRole("SELLER", "ADMIN");
  await requireEntitlement("ads");
  
  const { name, dailyBudget, cpcMax, keywords, targets, status } = await req.json();
  
  // Seller ID
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });
  
  // Kampanya sahipliği kontrolü
  const campaign = await prisma.adCampaign.findFirst({
    where: { id: params.id, sellerId: seller.id }
  });
  
  if (!campaign) return new Response("campaign_not_found", { status: 404 });
  
  // Güncelle
  const updatedCampaign = await prisma.$transaction(async (tx) => {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (dailyBudget) updateData.dailyBudget = Number(dailyBudget);
    if (cpcMax) updateData.cpcMax = Number(cpcMax);
    if (keywords) updateData.keywords = keywords.split(',').map((k: string) => k.trim());
    if (status) updateData.status = status;
    
    const updated = await tx.adCampaign.update({
      where: { id: params.id },
      data: updateData
    });
    
    // Hedef ürünleri güncelle
    if (targets) {
      await tx.adTarget.deleteMany({
        where: { campaignId: params.id }
      });
      
      await tx.adTarget.createMany({
        data: targets.map((productId: string) => ({
          campaignId: params.id,
          productId,
          weight: 1
        }))
      });
    }
    
    return updated;
  });
  
  return Response.json({ ok: true, campaign: updatedCampaign });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireRole("SELLER", "ADMIN");
  
  // Seller ID
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });
  
  // Kampanya sahipliği kontrolü
  const campaign = await prisma.adCampaign.findFirst({
    where: { id: params.id, sellerId: seller.id }
  });
  
  if (!campaign) return new Response("campaign_not_found", { status: 404 });
  
  // Status'u ENDED olarak işaretle (hard delete yapma)
  await prisma.adCampaign.update({
    where: { id: params.id },
    data: { status: "ENDED" }
  });
  
  return Response.json({ ok: true });
}
