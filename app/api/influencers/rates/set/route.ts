export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  const uid = (session.user as any).id;

  const { defaultPrice, categoryPrices = [] } = await req.json();
  await prisma.influencerProfile.update({
    where: { userId: uid },
    data: { defaultPrice: defaultPrice ? Number(defaultPrice) : null },
  });

  // categoryPrices: Array<{category:string, price:number}>
  for (const it of categoryPrices) {
    if (!it?.category || !Number.isFinite(Number(it?.price))) continue;
    await prisma.influencerRate.upsert({
      where: { influencerId_category: { influencerId: (await prisma.influencerProfile.findUnique({ where:{ userId: uid }, select: { id:true } })).id, category: String(it.category) } },
      update: { price: Number(it.price) },
      create: { influencerId: (await prisma.influencerProfile.findUnique({ where:{ userId: uid }, select: { id:true } })).id, category: String(it.category), price: Number(it.price) },
    });
  }

  return Response.json({ ok: true });
}
