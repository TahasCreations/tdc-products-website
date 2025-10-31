export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { Plan } from "@prisma/client";
export async function POST(req: NextRequest) {
  // TODO: Gerçek PSP webhook işlemi
  // 1. Webhook imza doğrulaması (iyzico/PayTR/Stripe)
  // 2. Ödeme durumu kontrolü
  // 3. Subscription oluşturma/güncelleme
  // 4. DomainAllowance oluşturma (yıllık plan için)
  // 5. Invoice oluşturma
  
  try {
    const body = await req.json();
    
    // Örnek webhook payload işleme
    // const { event, data } = body;
    
    // if (event === 'payment.completed') {
    //   // Ödeme tamamlandı, aboneliği aktif et
    //   const subscription = await prisma.subscription.create({
    //     data: {
    //       sellerId: data.sellerId,
    //       plan: data.plan as Plan,
    //       status: "active",
    //       billingCycle: data.billingCycle as any,
    //       price: data.price,
    //       currency: "TRY",
    //       periodStart: new Date(),
    //       periodEnd: data.periodEnd,
    //       meta: data.meta
    //     }
    //   });
    //   
    //   // Domain hakkı (yıllık plan için)
    //   if (data.includesDomain) {
    //     await prisma.domainAllowance.create({
    //       data: {
    //         sellerId: data.sellerId,
    //         years: 1,
    //         grantedBySubId: subscription.id
    //       }
    //     });
    //   }
    // }
    
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response("webhook_error", { status: 500 });
  }
}
