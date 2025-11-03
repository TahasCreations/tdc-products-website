import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Analytics Event Tracking API
 * Tracks user events, A/B tests, conversions
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties, userId, timestamp } = body;

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event name required' },
        { status: 400 }
      );
    }

    // Log event (in production, send to analytics backend)
    console.log('📊 Analytics Event:', {
      event,
      userId,
      properties,
      timestamp: timestamp || Date.now()
    });

    // Store in database if needed
    // await prisma.analyticsEvent.create({
    //   data: {
    //     event,
    //     userId,
    //     properties: JSON.stringify(properties),
    //     timestamp: new Date(timestamp || Date.now())
    //   }
    // });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

