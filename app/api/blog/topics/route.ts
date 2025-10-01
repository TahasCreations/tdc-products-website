import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock topics data
    const topics = [
      {
        id: '1',
        name: 'Trend',
        slug: 'trend',
        postCount: 15,
      },
      {
        id: '2',
        name: 'Rehber',
        slug: 'rehber',
        postCount: 8,
      },
      {
        id: '3',
        name: 'Duyuru',
        slug: 'duyuru',
        postCount: 5,
      },
      {
        id: '4',
        name: 'İnceleme',
        slug: 'inceleme',
        postCount: 12,
      },
      {
        id: '5',
        name: 'Haber',
        slug: 'haber',
        postCount: 7,
      },
    ];

    return NextResponse.json({ topics });

  } catch (error) {
    console.error('Blog topics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog topics' },
      { status: 500 }
    );
  }
}
