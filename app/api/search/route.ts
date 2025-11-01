import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json({ 
        results: [], 
        total: 0, 
        page: 1, 
        totalPages: 0 
      });
    }

    // Arama kriterleri oluştur
    const where: any = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        }
      ]
    };

    // Kategori filtresi
    if (category) {
      where.AND.push({ category: { contains: category, mode: 'insensitive' } });
    }

    // Fiyat filtresi
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      where.AND.push({ price: priceFilter });
    }

    // Marka filtresi
    if (brand) {
      where.AND.push({ brand: { contains: brand, mode: 'insensitive' } });
    }

    // Rating filtresi
    if (rating) {
      where.AND.push({ 
        rating: { 
          gte: parseFloat(rating) 
        } 
      });
    }

    // Sıralama kriterleri
    let orderBy: any = {};
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        // Relevance için title'da query geçen ürünleri önce getir
        orderBy = { 
          title: 'asc',
          rating: 'desc' 
        };
    }

    // Sayfalama
    const skip = (page - 1) * limit;

    // Ürünleri ara
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              rating: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    // Kategorileri ara
    const categories = await prisma.product.findMany({
      where: {
        category: { contains: query, mode: 'insensitive' }
      },
      select: {
        category: true
      },
      distinct: ['category'],
      take: 5
    });

    // Arama önerileri oluştur
    const suggestions = await generateSearchSuggestions(query);

    // Sonuçları formatla
    const results = products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.images?.[0] || '/placeholder-product.jpg',
      category: product.category,
      brand: product.brand,
      rating: product.rating,
      reviewCount: product.reviews.length,
      seller: product.seller,
      inStock: product.stock > 0,
      slug: product.slug
    }));

    return NextResponse.json({
      results,
      categories: categories.map(c => c.category),
      suggestions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Arama hatası:', error);
    return NextResponse.json({ 
      error: "Arama sırasında bir hata oluştu" 
    }, { status: 500 });
  }
}

// Arama önerileri oluştur
async function generateSearchSuggestions(query: string) {
  try {
    // Benzer ürün isimlerini bul
    const similarProducts = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        title: true
      },
      take: 5
    });

    // Popüler kategorileri bul
    const popularCategories = await prisma.product.findMany({
      where: {
        category: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        category: true
      },
      distinct: ['category'],
      take: 3
    });

    return {
      products: similarProducts.map(p => p.title),
      categories: popularCategories.map(c => c.category)
    };
  } catch (error) {
    console.error('Öneri oluşturma hatası:', error);
    return { products: [], categories: [] };
  }
}