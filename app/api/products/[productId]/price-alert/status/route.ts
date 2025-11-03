import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Check if price alert is enabled
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ enabled: false });
    }

    // In production: Check database
    // const alert = await prisma.priceAlert.findFirst({
    //   where: {
    //     userId: session.user.id,
    //     productId: params.productId,
    //     isActive: true
    //   }
    // });

    return NextResponse.json({ enabled: false });

  } catch (error) {
    console.error('Price alert status error:', error);
    return NextResponse.json({ enabled: false });
  }
}

