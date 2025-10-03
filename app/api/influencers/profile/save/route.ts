export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireInfluencer } from "@/lib/guards";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, profileId } = await requireInfluencer();
  const { displayName, bio, avatarUrl, basePrice, rates = [] } = await req.json();

  // Profil güncelle
  await prisma.influencerProfile.update({
    where: { id: profileId },
    data: {
      displayName,
      bio,
      avatarUrl,
      basePrice: basePrice ? Number(basePrice) : null
    }
  });

  // Fiyatları güncelle
  for (const rate of rates) {
    if (!rate.type || !Number.isFinite(Number(rate.price))) continue;
    
    await prisma.influencerRate.upsert({
      where: {
        influencerId_type: {
          influencerId: profileId,
          type: rate.type
        }
      },
      update: { price: Number(rate.price) },
      create: {
        influencerId: profileId,
        type: rate.type,
        price: Number(rate.price),
        productId: rate.productId || null
      }
    });
  }

  return Response.json({ ok: true });
}
