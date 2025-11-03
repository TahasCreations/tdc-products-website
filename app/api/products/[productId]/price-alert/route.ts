import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Enable price drop alert for a product
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = params;

    // In production: Save to database
    // await prisma.priceAlert.create({
    //   data: {
    //     userId: session.user.id,
    //     productId,
    //     isActive: true
    //   }
    // });

    console.log(`📊 Price alert enabled for product ${productId}`);

    return NextResponse.json({
      success: true,
      message: 'Price alert enabled'
    });

  } catch (error) {
    console.error('Price alert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enable alert' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Disable price alert
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = params;

    // In production: Delete from database
    // await prisma.priceAlert.deleteMany({
    //   where: {
    //     userId: session.user.id,
    //     productId
    //   }
    // });

    console.log(`📊 Price alert disabled for product ${productId}`);

    return NextResponse.json({
      success: true,
      message: 'Price alert disabled'
    });

  } catch (error) {
    console.error('Price alert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to disable alert' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

