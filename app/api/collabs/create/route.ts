export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { requireRole, platformFee, influencerTake } from "@/lib/guards";
export async function POST(req: NextRequest) {
  const { user } = await requireRole("SELLER", "ADMIN");
  const { influencerId, productId, title, description, deliverables, price, deadline } = await req.json();
  
  if (!influencerId || !productId || !title || !price) {
    return new Response("bad_request", { status: 400 });
  }

  // Seller ID
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });

  // Influencer kontrolü
  const influencer = await prisma.influencerProfile.findUnique({
    where: { id: influencerId, status: "APPROVED" }
  });
  
  if (!influencer) return new Response("influencer_not_found", { status: 404 });

  const priceNum = Number(price);
  const fee = platformFee(priceNum);
  const influencerAmount = influencerTake(priceNum);

  // İşbirliği oluştur
  const collab = await (prisma.collaboration.create as any)({
    data: {
      sellerId: seller.id,
      influencerId,
      productId,
      title,
      description,
      deliverables: deliverables || [],
      price: priceNum,
      platformFeePct: 0.10,
      deadline: deadline ? new Date(deadline) : null,
      trackingSlug: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  });

  // Sohbet oluştur
  await prisma.conversation.create({
    data: {
      collabId: collab.id,
      sellerId: seller.id,
      influencerId
    }
  });

  // Payout kaydı oluştur
  await prisma.payout.create({
    data: {
      influencerId,
      collabId: collab.id,
      amount: influencerAmount,
      status: "scheduled"
    }
  });

  return Response.json({ ok: true, collab });
}
