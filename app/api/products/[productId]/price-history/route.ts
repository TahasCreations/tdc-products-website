import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get price history for a product
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    // In production: Fetch from PriceHistory table
    // For now, generate mock data
    const history = generateMockPriceHistory();

    return NextResponse.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Price history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price history' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function generateMockPriceHistory() {
  const history = [];
  const basePrice = 149.99;
  const days = 30;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random price variation
    const variation = (Math.random() - 0.5) * 30;
    const price = Math.max(basePrice + variation, basePrice * 0.7);

    history.push({
      date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      price: Math.round(price * 100) / 100
    });
  }

  return history;
}

