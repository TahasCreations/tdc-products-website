import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth/middleware';
import { Permission } from '@/lib/rbac/permissions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    // Mock products data
    const mockProducts = [
      {
        id: '1',
        name: 'Özel Koleksiyon Figürü - Dragon Warrior',
        slug: 'ozel-koleksiyon-figuru-dragon-warrior',
        description: 'El yapımı özel koleksiyon figürü. Yüksek kalite reçine malzeme.',
        price: 299.99,
        comparePrice: 399.99,
        sku: 'TDCF-001',
        stock: 15,
        images: [
          '/images/products/dragon-warrior-1.jpg',
          '/images/products/dragon-warrior-2.jpg',
        ],
        category: {
          id: '1',
          name: 'Figür & Koleksiyon',
          slug: 'figur-koleksiyon',
        },
        seller: {
          id: '1',
          name: 'TDC Products',
          avatar: '/images/sellers/tdc-products.jpg',
        },
        rating: 4.8,
        reviewCount: 24,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        name: 'Vintage Klasik Saat',
        slug: 'vintage-klasik-saat',
        description: 'Retro tasarım klasik saat. Deri kayış ve metal gövde.',
        price: 149.99,
        comparePrice: null,
        sku: 'VKS-002',
        stock: 8,
        images: [
          '/images/products/vintage-watch-1.jpg',
          '/images/products/vintage-watch-2.jpg',
        ],
        category: {
          id: '2',
          name: 'Moda & Aksesuar',
          slug: 'moda-aksesuar',
        },
        seller: {
          id: '2',
          name: 'Vintage Collection',
          avatar: '/images/sellers/vintage-collection.jpg',
        },
        rating: 4.6,
        reviewCount: 18,
        isActive: true,
        createdAt: '2024-01-14T15:30:00Z',
      },
      {
        id: '3',
        name: 'Akıllı Bluetooth Kulaklık',
        slug: 'akilli-bluetooth-kulaklik',
        description: 'Yüksek ses kalitesi ve gürültü engelleme özellikli kulaklık.',
        price: 199.99,
        comparePrice: 249.99,
        sku: 'ABK-003',
        stock: 25,
        images: [
          '/images/products/bluetooth-headphones-1.jpg',
          '/images/products/bluetooth-headphones-2.jpg',
        ],
        category: {
          id: '3',
          name: 'Elektronik',
          slug: 'elektronik',
        },
        seller: {
          id: '3',
          name: 'TechGear',
          avatar: '/images/sellers/techgear.jpg',
        },
        rating: 4.7,
        reviewCount: 32,
        isActive: true,
        createdAt: '2024-01-13T09:15:00Z',
      },
      {
        id: '4',
        name: 'Modern Dekoratif Vazo',
        slug: 'modern-dekoratif-vazo',
        description: 'Minimalist tasarım dekoratif vazo. Seramik malzeme.',
        price: 79.99,
        comparePrice: null,
        sku: 'MDV-004',
        stock: 12,
        images: [
          '/images/products/decorative-vase-1.jpg',
          '/images/products/decorative-vase-2.jpg',
        ],
        category: {
          id: '4',
          name: 'Ev & Yaşam',
          slug: 'ev-yasam',
        },
        seller: {
          id: '4',
          name: 'Home Decor',
          avatar: '/images/sellers/home-decor.jpg',
        },
        rating: 4.5,
        reviewCount: 15,
        isActive: true,
        createdAt: '2024-01-12T14:20:00Z',
      },
    ];

    // Filter by category
    let filteredProducts = mockProducts;
    if (category) {
      filteredProducts = mockProducts.filter(product => product.category.slug === category);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort products
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredProducts.length;

    return NextResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      hasMore,
    });

  } catch (error) {
    console.error('Products list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest, context) => {
  try {
    const body = await request.json();
    const { name, description, price, categoryId, images, sku, stock } = body;

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create product
    const product = {
      id: `product_${Date.now()}`,
      name,
      slug,
      description,
      price: parseFloat(price),
      sku: sku || `SKU-${Date.now()}`,
      stock: parseInt(stock) || 0,
      images: images || [],
      categoryId,
      sellerId: context.user!.id,
      storeId: context.user!.storeId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production, save to database
    // await prisma.product.create({ data: product });

    return NextResponse.json({
      id: product.id,
      slug: product.slug,
      message: 'Product created successfully',
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
});
