export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { requireRole } from "@/lib/guards";
export async function POST(req: NextRequest) {
  const user = await requireRole("SELLER","ADMIN");
  const { logoUrl, primaryColor, heroImageUrls, headerLayout } = await req.json();
  
  const sp = await prisma.sellerProfile.findUnique({ 
    where: { userId: (user as any).id }, 
    select: { id:true }
  });
  if (!sp) return new Response("seller_profile_required",{status:400});
  
  const theme = await prisma.storeTheme.upsert({
    where: { sellerId: sp.id },
    update: { logoUrl, primaryColor, heroImageUrls, headerLayout },
    create: { sellerId: sp.id, logoUrl, primaryColor, heroImageUrls, headerLayout }
  });
  return Response.json({ ok:true, theme });
}
