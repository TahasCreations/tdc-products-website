export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/guards";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  await requireRole("ADMIN");
  const { hostname } = await req.json();
  if (!hostname) return new Response("bad_request",{status:400});
  
  // TODO: (opsiyonel) Vercel Domains API çağır ve projeye domain ekle.
  const upd = await prisma.storeDomain.update({
    where: { hostname: hostname.toLowerCase() },
    data: { status: "ACTIVE", verifiedAt: new Date() }
  });
  return Response.json({ ok:true, domain:upd });
}
