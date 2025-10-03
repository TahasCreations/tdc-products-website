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
    const now = new Date();
    
    // Süresi dolmuş aktif abonelikleri bul
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "active",
        periodEnd: { lt: now }
      },
      include: {
        seller: true
      }
    });
    
    let renewedCount = 0;
    
    for (const subscription of expiredSubscriptions) {
      const newPeriodStart = new Date(subscription.periodEnd);
      const newPeriodEnd = new Date(newPeriodStart);
      
      if (subscription.billingCycle === "MONTHLY") {
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
      } else {
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 12);
      }
      
      // Aboneliği yenile
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          periodStart: newPeriodStart,
          periodEnd: newPeriodEnd
        }
      });
      
      // Yeni fatura oluştur
      await prisma.invoice.create({
        data: {
          sellerId: subscription.sellerId,
          periodStart: newPeriodStart,
          periodEnd: newPeriodEnd,
          total: subscription.price || 0,
          pdfUrl: null
        }
      });
      
      // Yıllık plan için yeni domain hakkı
      if (subscription.billingCycle === "YEARLY") {
        await prisma.domainAllowance.create({
          data: {
            sellerId: subscription.sellerId,
            years: 1,
            grantedBySubId: subscription.id
          }
        });
      }
      
      renewedCount++;
    }
    
    console.log(`Renewed ${renewedCount} subscriptions`);
    
    return Response.json({ 
      ok: true, 
      renewedCount,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Error renewing subscriptions:', error);
    return new Response("internal_error", { status: 500 });
  }
}
