import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = headers();
    
    // Get client IP and user agent
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Create analytics event
    const event = {
      ...body,
      timestamp: new Date().toISOString(),
      ip: ip.split(',')[0].trim(), // Get first IP if multiple
      userAgent,
      sessionId: request.cookies.get('sessionId')?.value || 'anonymous',
    };

    // Log to console (in production, send to analytics service)
    console.log('Analytics Event:', JSON.stringify(event, null, 2));

    // In production, you would send this to:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - Custom analytics database
    // - Data warehouse

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
