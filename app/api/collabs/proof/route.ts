export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireInfluencer } from "@/lib/guards";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await requireInfluencer();
  const { collabId, proofUrls = [] } = await req.json();
  
  if (!collabId || !Array.isArray(proofUrls)) {
    return new Response("bad_request", { status: 400 });
  }

  // İşbirliği sahipliği kontrolü
  const collab = await prisma.collaboration.findUnique({
    where: { id: collabId, influencerId: userId }
  });

  if (!collab) return new Response("not_found", { status: 404 });

  // Kanıt URL'lerini güncelle
  const updatedCollab = await (prisma.collaboration.update as any)({
    where: { id: collabId },
    data: { proofUrls }
  });

  return Response.json({ ok: true, collab: updatedCollab });
}
