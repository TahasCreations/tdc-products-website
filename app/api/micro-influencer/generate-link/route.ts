import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Generate affiliate link
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }

    // Generate unique tracking code
    const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const affiliateUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}?ref=${trackingCode}`;

    // In production: Save to database
    // await prisma.affiliateLink.create({
    //   data: {
    //     userId: session.user.id,
    //     productId,
    //     trackingCode,
    //     url: affiliateUrl
    //   }
    // });

    console.log('🔗 Affiliate link generated:', trackingCode);

    return NextResponse.json({
      success: true,
      affiliateUrl,
      trackingCode
    });

  } catch (error) {
    console.error('Generate affiliate link error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate link' },
      { status: 500 }
    );
  }
}

