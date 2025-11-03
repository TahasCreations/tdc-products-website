import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get community forum topics
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';

    // In production: Fetch from database
    const topics = [];
    const categories = [
      { id: 'all', name: 'Tüm Konular', icon: '📋', topicCount: 0, color: 'gray' },
      { id: 'questions', name: 'Sorular', icon: '❓', topicCount: 0, color: 'blue' },
      { id: 'reviews', name: 'Ürün Tavsiyeleri', icon: '⭐', topicCount: 0, color: 'yellow' },
      { id: 'diy', name: 'DIY & Projeler', icon: '🛠️', topicCount: 0, color: 'purple' },
      { id: 'unboxing', name: 'Kutu Açılışları', icon: '📦', topicCount: 0, color: 'green' },
      { id: 'deals', name: 'Fırsatlar', icon: '💰', topicCount: 0, color: 'red' }
    ];

    return NextResponse.json({
      success: true,
      topics,
      categories
    });

  } catch (error) {
    console.error('Forum topics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create new topic
 */
export async function POST(req: NextRequest) {
  try {
    const session = await (await import('next-auth')).getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content required' },
        { status: 400 }
      );
    }

    // In production: Save to database
    // await prisma.forumTopic.create({
    //   data: {
    //     title,
    //     content,
    //     category,
    //     authorId: session.user.id
    //   }
    // });

    console.log('📝 New forum topic created:', title);

    return NextResponse.json({
      success: true,
      message: 'Topic created successfully'
    });

  } catch (error) {
    console.error('Create topic error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create topic' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

