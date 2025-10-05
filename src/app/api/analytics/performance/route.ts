import { NextRequest, NextResponse } from 'next/server';
import { PerformanceMetric } from '@/lib/performance/analytics';

export async function POST(request: NextRequest) {
  try {
    const metric: PerformanceMetric = await request.json();
    
    // Validate metric data
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Log metric (in production, you'd send this to your analytics service)
    console.log('[Performance Metric]', {
      name: metric.name,
      value: metric.value,
      url: metric.url,
      timestamp: new Date(metric.timestamp).toISOString(),
      connection: metric.connection
    });

    // Here you would typically:
    // 1. Store in database
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Send to monitoring service (DataDog, New Relic, etc.)
    // 4. Check against performance budgets

    // Example: Store in database
    // await prisma.performanceMetric.create({
    //   data: {
    //     name: metric.name,
    //     value: metric.value,
    //     url: metric.url,
    //     timestamp: new Date(metric.timestamp),
    //     userAgent: metric.userAgent,
    //     connection: metric.connection
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process performance metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const metric = searchParams.get('metric');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // In production, you'd query your database
    // const metrics = await prisma.performanceMetric.findMany({
    //   where: {
    //     ...(page && { url: { contains: page } }),
    //     ...(metric && { name: metric }),
    //     ...(startDate && { timestamp: { gte: new Date(startDate) } }),
    //     ...(endDate && { timestamp: { lte: new Date(endDate) } })
    //   },
    //   orderBy: { timestamp: 'desc' },
    //   take: 100
    // });

    // Mock data for demo
    const mockMetrics: PerformanceMetric[] = [
      {
        name: 'page_load_time',
        value: 1250,
        timestamp: Date.now() - 300000,
        url: '/',
        connection: '4g-10Mbps'
      },
      {
        name: 'first_contentful_paint',
        value: 800,
        timestamp: Date.now() - 300000,
        url: '/',
        connection: '4g-10Mbps'
      },
      {
        name: 'largest_contentful_paint',
        value: 1200,
        timestamp: Date.now() - 300000,
        url: '/',
        connection: '4g-10Mbps'
      }
    ];

    return NextResponse.json({
      metrics: mockMetrics,
      summary: {
        average: mockMetrics.reduce((sum, m) => sum + m.value, 0) / mockMetrics.length,
        count: mockMetrics.length,
        latest: mockMetrics[0]
      }
    });
  } catch (error) {
    console.error('Failed to fetch performance metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
