export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Secret token kontrolü
  const authHeader = req.headers.get('authorization');
  const secretToken = process.env.CRON_SECRET_TOKEN;
  
  if (!secretToken || authHeader !== `Bearer ${secretToken}`) {
    return new Response("unauthorized", { status: 401 });
  }
  
  try {
    // Tüm aktif kampanyalarda spentToday'ı sıfırla
    const result = await prisma.adCampaign.updateMany({
      where: { status: "ACTIVE" },
      data: { spentToday: 0 }
    });
    
    console.log(`Reset spend for ${result.count} active campaigns`);
    
    return Response.json({ 
      ok: true, 
      resetCount: result.count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resetting ad spend:', error);
    return new Response("internal_error", { status: 500 });
  }
}
