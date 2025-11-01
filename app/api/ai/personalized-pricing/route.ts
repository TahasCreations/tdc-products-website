export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';

interface PricingFactors {
  loyaltyScore: number;
  purchaseHistory: number;
  browsingTime: number;
  cartAbandonment: boolean;
  wishlistCount: number;
  referralCount: number;
}

export async function POST(req: NextRequest) {
  try {
    const { productId, userId, basePrice } = await req.json();

    if (!userId) {
      return Response.json({ success: false, error: 'User ID required' });
    }

    // Get user data for personalization
    const [user, orders, wishlist] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.order.findMany({ 
        where: { userId },
        select: { status: true, total: true },
      }),
      prisma.wishlistItem.count({ where: { userId } }),
    ]);

    // Calculate pricing factors
    const factors: PricingFactors = {
      loyaltyScore: calculateLoyaltyScore(orders),
      purchaseHistory: orders.length,
      browsingTime: 0, // Would be calculated from analytics
      cartAbandonment: false, // Would be checked from cart history
      wishlistCount: wishlist,
      referralCount: 0, // Would be from referral system
    };

    // Calculate discount based on factors
    let discount = 0;
    const reasons: string[] = [];

    // Loyalty discount
    if (factors.loyaltyScore > 70) {
      discount += 10;
      reasons.push(`${factors.loyaltyScore} puanlı sadakat üyesisiniz`);
    } else if (factors.loyaltyScore > 50) {
      discount += 5;
      reasons.push(`${factors.loyaltyScore} puanlı müşterisiniz`);
    }

    // Purchase history discount
    if (factors.purchaseHistory >= 10) {
      discount += 8;
      reasons.push('10+ siparişiniz var');
    } else if (factors.purchaseHistory >= 5) {
      discount += 5;
      reasons.push('5+ siparişiniz var');
    }

    // Wishlist activity
    if (factors.wishlistCount >= 10) {
      discount += 5;
      reasons.push('Favoriler listenizde');
    }

    // Cap discount at 25%
    discount = Math.min(discount, 25);

    // Only show offer if discount is significant (>= 5%)
    if (discount < 5) {
      return Response.json({ 
        success: true, 
        offer: null,
        message: 'No eligible offer' 
      });
    }

    const personalizedPrice = basePrice * (1 - discount / 100);
    const primaryReason = reasons[0] || 'Size özel teklif';

    return Response.json({
      success: true,
      offer: {
        originalPrice: basePrice,
        personalizedPrice: Math.round(personalizedPrice),
        discount: discount,
        reason: primaryReason,
        expiry: 15, // 15 minutes
        eligibility: reasons.join(', '),
      },
    });
  } catch (error) {
    console.error('Personalized pricing error:', error);
    return Response.json(
      { success: false, error: 'Failed to calculate personalized pricing' },
      { status: 500 }
    );
  }
}

function calculateLoyaltyScore(orders: any[]): number {
  let score = 0;
  
  // Completed orders
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  score += completedOrders.length * 5;
  
  // Total spent
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  score += Math.floor(totalSpent / 1000) * 2; // 2 points per 1000 TL
  
  // Cap at 100
  return Math.min(100, score);
}


