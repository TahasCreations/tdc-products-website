export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/src/lib/auth";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  
  const { influencerId, productId, agreedPrice } = await req.json();
  if (!influencerId || !productId || !agreedPrice) {
    return new Response("bad_request", { status: 400 });
  }

  // Seller ID
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: (session.user as any).id },
    select: { id: true }
  });
  
  if (!seller) return new Response("seller_profile_required", { status: 400 });

  // Platform fee (%10)
  const platformFee = Number(agreedPrice) * 0.1;

  // İşbirliği oluştur
  const collab = await prisma.influencerCollab.create({
    data: {
      sellerId: seller.id,
      influencerId,
      productId,
      agreedPrice: Number(agreedPrice),
      platformFee,
      status: "REQUESTED"
    }
  });

  // Sohbet oluştur
  await prisma.conversation.create({
    data: {
      collabId: collab.id
    }
  });

  return Response.json({ ok: true, collab });
}
