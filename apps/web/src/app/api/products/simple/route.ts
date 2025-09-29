import { NextRequest, NextResponse } from 'next/server';

// Basitleştirilmiş Products API - Performans için
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Mock data for now - Real database integration later
    const mockProducts = [
      {
        id: '1',
        name: 'Naruto Uzumaki Figürü',
        slug: 'naruto-uzumaki-figuru',
        description: 'Naruto anime serisinin ana karakteri Naruto Uzumaki\'nin detaylı 3D baskı figürü.',
        price: 89.99,
        comparePrice: 120.00,
        currency: 'TRY',
        stockQuantity: 50,
        status: 'active',
        visibility: 'public',
        isFeatured: true,
        images: ['https://via.placeholder.com/300x300?text=Naruto+Figur'],
        category: {
          id: 'cat1',
          name: 'Anime Figürler',
          slug: 'anime-figurler'
        },
        viewCount: 1250,
        purchaseCount: 45,
        averageRating: 4.8,
        totalReviews: 23,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      },
      {
        id: '2',
        name: 'Monkey D. Luffy Figürü',
        slug: 'monkey-d-luffy-figuru',
        description: 'One Piece serisinin ana karakteri Luffy\'nin epik pozda 3D baskı figürü.',
        price: 129.99,
        comparePrice: 150.00,
        currency: 'TRY',
        stockQuantity: 30,
        status: 'active',
        visibility: 'public',
        isFeatured: false,
        images: ['https://via.placeholder.com/300x300?text=Luffy+Figur'],
        category: {
          id: 'cat1',
          name: 'Anime Figürler',
          slug: 'anime-figurler'
        },
        viewCount: 980,
        purchaseCount: 32,
        averageRating: 4.6,
        totalReviews: 18,
        createdAt: '2024-01-18T14:00:00Z',
        updatedAt: '2024-01-22T09:15:00Z'
      },
      {
        id: '3',
        name: 'Ahri Figürü',
        slug: 'ahri-figuru',
        description: 'League of Legends\'in popüler karakteri Ahri\'nin zarif 3D baskı figürü.',
        price: 149.99,
        comparePrice: 180.00,
        currency: 'TRY',
        stockQuantity: 25,
        status: 'active',
        visibility: 'public',
        isFeatured: true,
        images: ['https://via.placeholder.com/300x300?text=Ahri+Figur'],
        category: {
          id: 'cat2',
          name: 'Oyun Figürler',
          slug: 'oyun-figurler'
        },
        viewCount: 2100,
        purchaseCount: 67,
        averageRating: 4.9,
        totalReviews: 41,
        createdAt: '2024-01-20T11:30:00Z',
        updatedAt: '2024-01-25T16:45:00Z'
      },
      {
        id: '4',
        name: 'Batman Figürü',
        slug: 'batman-figuru',
        description: 'DC Comics\'in efsanevi kahramanı Batman\'in detaylı 3D baskı figürü.',
        price: 199.99,
        comparePrice: 250.00,
        currency: 'TRY',
        stockQuantity: 15,
        status: 'active',
        visibility: 'public',
        isFeatured: true,
        images: ['https://via.placeholder.com/300x300?text=Batman+Figur'],
        category: {
          id: 'cat3',
          name: 'Film Figürler',
          slug: 'film-figurler'
        },
        viewCount: 1800,
        purchaseCount: 28,
        averageRating: 4.7,
        totalReviews: 15,
        createdAt: '2024-01-22T08:45:00Z',
        updatedAt: '2024-01-26T12:20:00Z'
      },
      {
        id: '5',
        name: 'Spider-Man Figürü',
        slug: 'spider-man-figuru',
        description: 'Marvel\'in sevilen süper kahramanı Spider-Man\'in dinamik 3D baskı figürü.',
        price: 179.99,
        comparePrice: 220.00,
        currency: 'TRY',
        stockQuantity: 20,
        status: 'active',
        visibility: 'public',
        isFeatured: false,
        images: ['https://via.placeholder.com/300x300?text=SpiderMan+Figur'],
        category: {
          id: 'cat3',
          name: 'Film Figürler',
          slug: 'film-figurler'
        },
        viewCount: 1650,
        purchaseCount: 35,
        averageRating: 4.5,
        totalReviews: 22,
        createdAt: '2024-01-25T13:15:00Z',
        updatedAt: '2024-01-28T10:30:00Z'
      }
    ];
    
    // Apply filters
    let filteredProducts = mockProducts;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.slug === category
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'purchaseCount':
          aValue = a.purchaseCount;
          bValue = b.purchaseCount;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
