export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/guards";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  await requireRole("SELLER","ADMIN");
  const { platform = "", minFollowers, maxPrice, niche = [], limit = 30, offset = 0 } = await req.json();

  const influencers = await prisma.influencerProfile.findMany({
    where: {
      status: "APPROVED",
      visible: true,
      ...(platform ? { platforms: { has: platform } } : {}),
      ...(minFollowers ? { followers: { gte: Number(minFollowers) } } : {}),
      ...(niche.length > 0 ? { niches: { hasSome: niche } } : {}),
    },
    select: { 
      id: true, 
      displayName: true, 
      followers: true, 
      profileLinks: true, 
      basePrice: true, 
      platforms: true,
      rates: {
        select: { type: true, price: true }
      }
    },
    orderBy: [{ followers: "desc" }],
    take: Number(limit),
    skip: Number(offset),
  });

  // Fiyat filtresi (maxPrice)
  const filteredInfluencers = maxPrice 
    ? influencers.filter(inf => {
        const minRate = Math.min(...inf.rates.map(r => Number(r.price)));
        return minRate <= Number(maxPrice);
      })
    : influencers;

  return Response.json({ items: filteredInfluencers });
}
