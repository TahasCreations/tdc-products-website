export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check CRON_KEY
    const url = new URL(request.url);
    const cronKey = url.searchParams.get('key');
    
    if (cronKey !== process.env.CRON_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    let renewedCount = 0;

    // Find expired active subscriptions
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
        periodEnd: {
          lt: now,
        },
      },
    });

    for (const subscription of expiredSubscriptions) {
      const newPeriodStart = now;
      let newPeriodEnd: Date;

      // Calculate new period end based on billing cycle
      if (subscription.billingCycle === 'MONTHLY') {
        newPeriodEnd = new Date(now);
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
      } else if (subscription.billingCycle === 'YEARLY') {
        newPeriodEnd = new Date(now);
        newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
      } else {
        console.warn(`Unknown billing cycle: ${subscription.billingCycle}`);
        continue;
      }

      // Update subscription
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          periodStart: newPeriodStart,
          periodEnd: newPeriodEnd,
        },
      });

      // Create demo invoice (TODO: Replace with real PSP integration)
      await prisma.invoice.create({
        data: {
          sellerId: subscription.sellerId,
          amount: subscription.price,
          currency: subscription.currency,
          status: 'PENDING',
          dueDate: newPeriodEnd,
          description: `Subscription renewal - ${subscription.plan} (${subscription.billingCycle})`,
          meta: {
            subscriptionId: subscription.id,
            billingCycle: subscription.billingCycle,
            periodStart: newPeriodStart.toISOString(),
            periodEnd: newPeriodEnd.toISOString(),
            note: 'DEMO: Real PSP integration needed',
          },
        },
      });

      renewedCount++;
    }

    return NextResponse.json({
      ok: true,
      renewed: renewedCount,
      message: `Renewed ${renewedCount} subscriptions`,
    });
  } catch (error) {
    console.error('Billing renewal failed:', error);
    return NextResponse.json(
      { 
        error: 'Renewal failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
