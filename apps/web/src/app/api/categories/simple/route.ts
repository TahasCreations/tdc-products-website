import { NextRequest, NextResponse } from 'next/server';

// Basitleştirilmiş Categories API - Performans için
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Mock categories data
    const mockCategories = [
      {
        id: 'cat1',
        name: '3D Baskı Figürler',
        slug: '3d-baski-figurler',
        description: 'Anime, oyun ve film karakterlerinin 3D baskı figürleri',
        parentId: null,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'cat2',
        name: 'Anime Figürler',
        slug: 'anime-figurler',
        description: 'Popüler anime karakterlerinin figürleri',
        parentId: 'cat1',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'cat3',
        name: 'Oyun Figürler',
        slug: 'oyun-figurler',
        description: 'Video oyun karakterlerinin figürleri',
        parentId: 'cat1',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'cat4',
        name: 'Film Figürler',
        slug: 'film-figurler',
        description: 'Hollywood ve dünya sineması karakterleri',
        parentId: 'cat1',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'cat5',
        name: 'Özel Tasarım',
        slug: 'ozel-tasarim',
        description: 'Kişiye özel tasarım figürler',
        parentId: 'cat1',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    // Filter active categories if needed
    let categories = mockCategories;
    if (!includeInactive) {
      categories = categories.filter(cat => cat.isActive);
    }
    
    // Sort by name
    categories.sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
