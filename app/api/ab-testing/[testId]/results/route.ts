import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * A/B Test Results API
 * Returns test results and statistics
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { testId } = params;

    // In production, fetch from database
    // For now, return mock data
    const results = [
      {
        testId,
        variantId: 'control',
        conversions: 120,
        visitors: 1000,
        conversionRate: 12.0,
        revenue: 15000,
        confidence: 95
      },
      {
        testId,
        variantId: 'variant_a',
        conversions: 145,
        visitors: 1000,
        conversionRate: 14.5,
        revenue: 18000,
        confidence: 98
      }
    ];

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Failed to fetch test results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

