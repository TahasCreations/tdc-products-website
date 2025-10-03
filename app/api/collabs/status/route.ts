export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, requireRole } from "@/src/lib/guards";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  
  const { collabId, status } = await req.json();
  if (!collabId || !status) {
    return new Response("bad_request", { status: 400 });
  }

  // İşbirliği sahipliği kontrolü
  const collab = await prisma.collaboration.findUnique({
    where: { id: collabId },
    include: { 
      seller: { select: { userId: true } },
      influencer: { select: { userId: true } }
    }
  });

  if (!collab) return new Response("not_found", { status: 404 });

  const userId = (session.user as any).id;
  const isSeller = collab.seller.userId === userId;
  const isInfluencer = collab.influencer.userId === userId;
  const isAdmin = session.user.role === "ADMIN";

  if (!isSeller && !isInfluencer && !isAdmin) {
    return new Response("forbidden", { status: 403 });
  }

  // Durum güncelleme yetkisi kontrolü
  if (status === "ACCEPTED" && !isInfluencer) {
    return new Response("only_influencer_can_accept", { status: 403 });
  }
  
  if (status === "COMPLETED" && !isSeller && !isAdmin) {
    return new Response("only_seller_can_complete", { status: 403 });
  }

  // Durum güncelle
  const updatedCollab = await prisma.collaboration.update({
    where: { id: collabId },
    data: { status }
  });

  // Tamamlanırsa ledger kayıtları oluştur
  if (status === "COMPLETED") {
    const fee = Number(collab.price) * 0.10;
    const influencerAmount = Number(collab.price) * 0.90;

    // Platform fee
    await prisma.ledgerEntry.create({
      data: {
        sellerId: null,
        type: "PLATFORM_FEE",
        amount: fee,
        currency: "TRY",
        meta: { collabId }
      }
    });

    // Influencer payout
    await prisma.ledgerEntry.create({
      data: {
        sellerId: null,
        type: "PAYOUT",
        amount: -influencerAmount,
        currency: "TRY",
        meta: { influencerId: collab.influencerId, collabId }
      }
    });
  }

  return Response.json({ ok: true, collab: updatedCollab });
}
