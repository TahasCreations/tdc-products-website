export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  
  const { searchParams } = new URL(req.url);
  const collabId = searchParams.get('collabId');
  
  if (!collabId) {
    return new Response("bad_request", { status: 400 });
  }

  // İşbirliği sahipliği kontrolü
  const collab = await prisma.influencerCollab.findUnique({
    where: { id: collabId },
    include: { 
      seller: { select: { userId: true } },
      influencer: { select: { userId: true } },
      conversation: { select: { id: true } }
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

  // Mesajları getir
  const messages = await prisma.message.findMany({
    where: { conversationId: collab.conversation!.id },
    orderBy: { createdAt: 'asc' }
  });

  return Response.json({ messages });
}
