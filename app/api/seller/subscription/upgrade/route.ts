import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sellerId, plan, billingCycle } = await req.json();

    if (!sellerId || !plan || !billingCycle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify seller ownership
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { id: sellerId, userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Cancel existing active subscriptions
    await prisma.subscription.updateMany({
      where: {
        sellerId,
        status: 'active',
      },
      data: {
        status: 'cancelled',
      },
    });

    // Calculate price based on plan
    const prices: Record<string, number> = {
      FREE: 0,
      STARTER: 299,
      GROWTH: 599,
      PRO: 1299,
    };

    let price = prices[plan] || 0;
    
    // Apply yearly discount
    if (billingCycle === 'YEARLY') {
      price = price * 12 * 0.8; // 20% discount
    }

    // Calculate period dates
    const periodStart = new Date();
    const periodEnd = new Date();
    if (billingCycle === 'MONTHLY') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        sellerId,
        plan,
        status: 'active',
        billingCycle,
        price,
        currency: 'TRY',
        periodStart,
        periodEnd,
      },
    });

    // Grant domain allowances for certain plans
    if (plan === 'STARTER' || plan === 'GROWTH' || plan === 'PRO') {
      const domainYears = plan === 'PRO' ? 2 : 1;
      await prisma.domainAllowance.create({
        data: {
          sellerId,
          years: domainYears,
          grantedBySubId: subscription.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

