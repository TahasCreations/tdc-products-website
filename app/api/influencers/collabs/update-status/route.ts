export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/src/lib/auth";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  
  const { collabId, status } = await req.json();
  if (!collabId || !status) {
    return new Response("bad_request", { status: 400 });
  }

  // İşbirliği sahipliği kontrolü
  const collab = await prisma.influencerCollab.findUnique({
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

  // Durum güncelleme
  const updatedCollab = await prisma.influencerCollab.update({
    where: { id: collabId },
    data: { status }
  });

  return Response.json({ ok: true, collab: updatedCollab });
}
