export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { requireRole } from "@/lib/guards";
export async function POST(req: NextRequest) {
  const { user } = await requireRole("ADMIN");
  const { applicationId, approve=true } = await req.json();
  if (!applicationId) return new Response("bad_request", { status: 400 });
  
  const application = await prisma.influencerApplication.findUnique({
    where: { id: applicationId }
  });
  
  if (!application) return new Response("not_found", { status: 404 });
  
  const status = approve ? "APPROVED" : "REJECTED";
  
  // Başvuruyu güncelle
  await prisma.influencerApplication.update({
    where: { id: applicationId },
    data: { status /* reviewedBy: (user as any).id */ }
  });
  
  // Onaylanırsa InfluencerProfile oluştur
  if (approve) {
    const profile = await (prisma.influencerProfile.create as any)({
      data: {
        userId: application.userId,
        displayName: `Influencer_${application.userId.slice(-6)}`,
        // platforms: application.platforms,
        // profileLinks: application.profileLinks,
        // followers: application.followers,
        // engagement: application.engagement,
        status: "APPROVED"
      }
    });
    return Response.json({ ok: true, profile });
  }
  
  return Response.json({ ok: true });
}
