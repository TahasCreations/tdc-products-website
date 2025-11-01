export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  
  const { collabId, body } = await req.json();
  if (!collabId || !body) {
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

  // Sender role belirleme
  let senderRole = "ADMIN";
  if (isSeller) senderRole = "SELLER";
  else if (isInfluencer) senderRole = "INFLUENCER";

  // Mesaj oluştur
  const message = await prisma.message.create({
    data: {
      conversationId: collab.conversation!.id,
      senderRole,
      body: String(body)
    }
  });

  return Response.json({ ok: true, message });
}
