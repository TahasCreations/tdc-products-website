import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'loadTime';
    const order = searchParams.get('order') || 'desc';

    let pages = [];

    if (supabase) {
      // Supabase'den sayfa performans verilerini çek
      let query = supabase
        .from('page_performance')
        .select(`
          id,
          page_name,
          page_url,
          load_time,
          first_contentful_paint,
          largest_contentful_paint,
          cumulative_layout_shift,
          first_input_delay,
          total_blocking_time,
          speed_index,
          performance_score,
          last_tested,
          created_at
        `)
        .order(sortBy, { ascending: order === 'asc' });

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase page performance error:', error);
        throw error;
      }

      pages = data?.map(page => ({
        id: page.id,
        name: page.page_name || 'Unknown Page',
        url: page.page_url || '',
        loadTime: page.load_time || 0,
        firstContentfulPaint: page.first_contentful_paint || 0,
        largestContentfulPaint: page.largest_contentful_paint || 0,
        cumulativeLayoutShift: page.cumulative_layout_shift || 0,
        firstInputDelay: page.first_input_delay || 0,
        totalBlockingTime: page.total_blocking_time || 0,
        speedIndex: page.speed_index || 0,
        performanceScore: page.performance_score || 0,
        lastTested: page.last_tested || page.created_at,
        createdAt: page.created_at
      })) || [];

    } else {
      // Fallback: Mock data
      pages = [
        {
          id: '1',
          name: 'Homepage',
          url: '/',
          loadTime: 1.2,
          firstContentfulPaint: 800,
          largestContentfulPaint: 1200,
          cumulativeLayoutShift: 0.05,
          firstInputDelay: 50,
          totalBlockingTime: 100,
          speedIndex: 1200,
          performanceScore: 95,
          lastTested: '2024-01-20T10:00:00Z',
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'Products Page',
          url: '/products',
          loadTime: 2.8,
          firstContentfulPaint: 1500,
          largestContentfulPaint: 2800,
          cumulativeLayoutShift: 0.12,
          firstInputDelay: 120,
          totalBlockingTime: 200,
          speedIndex: 2500,
          performanceScore: 78,
          lastTested: '2024-01-20T09:30:00Z',
          createdAt: '2024-01-20T09:30:00Z'
        },
        {
          id: '3',
          name: 'Admin Dashboard',
          url: '/admin/dashboard',
          loadTime: 4.2,
          firstContentfulPaint: 2000,
          largestContentfulPaint: 4200,
          cumulativeLayoutShift: 0.18,
          firstInputDelay: 200,
          totalBlockingTime: 350,
          speedIndex: 3800,
          performanceScore: 65,
          lastTested: '2024-01-20T09:00:00Z',
          createdAt: '2024-01-20T09:00:00Z'
        },
        {
          id: '4',
          name: 'Checkout',
          url: '/checkout',
          loadTime: 3.5,
          firstContentfulPaint: 1800,
          largestContentfulPaint: 3500,
          cumulativeLayoutShift: 0.08,
          firstInputDelay: 150,
          totalBlockingTime: 280,
          speedIndex: 3200,
          performanceScore: 72,
          lastTested: '2024-01-20T08:45:00Z',
          createdAt: '2024-01-20T08:45:00Z'
        },
        {
          id: '5',
          name: 'About Page',
          url: '/about',
          loadTime: 1.4,
          firstContentfulPaint: 900,
          largestContentfulPaint: 1400,
          cumulativeLayoutShift: 0.03,
          firstInputDelay: 60,
          totalBlockingTime: 80,
          speedIndex: 1300,
          performanceScore: 92,
          lastTested: '2024-01-20T08:30:00Z',
          createdAt: '2024-01-20T08:30:00Z'
        },
        {
          id: '6',
          name: 'Contact Page',
          url: '/contact',
          loadTime: 1.6,
          firstContentfulPaint: 1000,
          largestContentfulPaint: 1600,
          cumulativeLayoutShift: 0.04,
          firstInputDelay: 70,
          totalBlockingTime: 90,
          speedIndex: 1500,
          performanceScore: 90,
          lastTested: '2024-01-20T08:15:00Z',
          createdAt: '2024-01-20T08:15:00Z'
        },
        {
          id: '7',
          name: 'Blog',
          url: '/blog',
          loadTime: 2.1,
          firstContentfulPaint: 1200,
          largestContentfulPaint: 2100,
          cumulativeLayoutShift: 0.09,
          firstInputDelay: 100,
          totalBlockingTime: 150,
          speedIndex: 1900,
          performanceScore: 85,
          lastTested: '2024-01-20T08:00:00Z',
          createdAt: '2024-01-20T08:00:00Z'
        },
        {
          id: '8',
          name: 'Cart',
          url: '/cart',
          loadTime: 2.5,
          firstContentfulPaint: 1400,
          largestContentfulPaint: 2500,
          cumulativeLayoutShift: 0.11,
          firstInputDelay: 110,
          totalBlockingTime: 180,
          speedIndex: 2200,
          performanceScore: 80,
          lastTested: '2024-01-20T07:45:00Z',
          createdAt: '2024-01-20T07:45:00Z'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: pages,
      pagination: {
        page,
        limit,
        total: pages.length
      }
    });

  } catch (error) {
    console.error('Page performance error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch page performance data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
