export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("auth_required", { status: 401 });
  const { platforms = [], profileLinks = [], followers, engagement, niches = [], note } = await req.json();

  const data = {
    userId: (session.user as any).id,
    platforms,
    profileLinks,
    followers: followers ? Number(followers) : null,
    engagement: engagement ? Number(engagement) : null,
    niches,
    note,
    status: "PENDING" as const,
  };

  const app = await (prisma.influencerApplication.create as any)({
    data
  });
  return Response.json({ ok: true, application: app });
}
