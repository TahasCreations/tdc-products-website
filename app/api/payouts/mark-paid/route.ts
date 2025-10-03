export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/src/lib/guards";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  await requireRole("ADMIN");
  const { payoutId } = await req.json();
  
  if (!payoutId) {
    return new Response("bad_request", { status: 400 });
  }

  // Payout'u bul
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: { collaboration: { select: { status: true } } }
  });

  if (!payout) return new Response("not_found", { status: 404 });

  // Sadece tamamlanmış işbirlikleri için payout işaretlenebilir
  if (payout.collaboration.status !== "COMPLETED") {
    return new Response("collab_not_completed", { status: 400 });
  }

  // Payout'u "paid" olarak işaretle
  const updatedPayout = await prisma.payout.update({
    where: { id: payoutId },
    data: { 
      status: "paid",
      processedAt: new Date()
    }
  });

  return Response.json({ ok: true, payout: updatedPayout });
}
