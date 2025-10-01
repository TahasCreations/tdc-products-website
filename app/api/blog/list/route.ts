import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { Permission } from '@/lib/rbac/permissions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'newest';
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');

    // Mock data for development
    const mockPosts = [
      {
        id: '1',
        title: 'TDC Market\'te En Trend Ürünler',
        slug: 'tdc-markette-en-trend-urunler',
        excerpt: 'Bu ay TDC Market\'te en çok satan ve trend olan ürünleri keşfedin.',
        coverUrl: '/images/blog/trend-products.jpg',
        author: {
          name: 'Ahmet Yılmaz',
          handle: 'ahmet-yilmaz',
          avatarUrl: '/images/avatars/ahmet.jpg',
        },
        topic: {
          name: 'Trend',
          slug: 'trend',
        },
        tags: ['trend', 'ürünler', 'popüler'],
        readingTime: 5,
        publishedAt: '2024-01-15T10:00:00Z',
        likes: 42,
        views: 156,
        isLiked: false,
        isSaved: false,
      },
      {
        id: '2',
        title: 'Koleksiyon Figürlerinde Kalite Nasıl Anlaşılır?',
        slug: 'koleksiyon-figurlerinde-kalite-nasil-anlasilir',
        excerpt: 'Gerçek koleksiyon figürlerini sahte olanlardan ayırt etmenin yolları.',
        coverUrl: '/images/blog/quality-guide.jpg',
        author: {
          name: 'Elif Kaya',
          handle: 'elif-kaya',
          avatarUrl: '/images/avatars/elif.jpg',
        },
        topic: {
          name: 'Rehber',
          slug: 'rehber',
        },
        tags: ['kalite', 'rehber', 'figür'],
        readingTime: 8,
        publishedAt: '2024-01-12T14:30:00Z',
        likes: 28,
        views: 89,
        isLiked: true,
        isSaved: false,
      },
      {
        id: '3',
        title: 'TDC Products Özel Serisi Lansmanı',
        slug: 'tdc-products-ozel-serisi-lansmani',
        excerpt: 'TDC Products\'ın yeni özel figür serisinin detayları ve ön sipariş bilgileri.',
        coverUrl: '/images/blog/tdc-products-launch.jpg',
        author: {
          name: 'TDC Team',
          handle: 'tdc-team',
          avatarUrl: '/images/avatars/tdc-team.jpg',
        },
        topic: {
          name: 'Duyuru',
          slug: 'duyuru',
        },
        tags: ['tdc-products', 'lansman', 'özel-seri'],
        readingTime: 6,
        publishedAt: '2024-01-10T09:00:00Z',
        likes: 67,
        views: 234,
        isLiked: false,
        isSaved: true,
      },
    ];

    // Filter by topic
    let filteredPosts = mockPosts;
    if (topic) {
      filteredPosts = mockPosts.filter(post => post.topic.slug === topic);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort posts
    switch (sort) {
      case 'trending':
        filteredPosts.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
        break;
      case 'most_liked':
        filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'most_viewed':
        filteredPosts.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredPosts.length;

    return NextResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      page,
      limit,
      hasMore,
    });

  } catch (error) {
    console.error('Blog list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
