import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Ürün önerileri
    const productSuggestions = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        title: true
      },
      take: limit,
      distinct: ['title']
    });

    // Kategori önerileri
    const categorySuggestions = await prisma.product.findMany({
      where: {
        category: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        category: true
      },
      take: Math.ceil(limit / 2),
      distinct: ['category']
    });

    // Marka önerileri
    const brandSuggestions = await prisma.product.findMany({
      where: {
        brand: {
          contains: query,
          mode: 'insensitive',
          not: null
        }
      },
      select: {
        brand: true
      },
      take: Math.ceil(limit / 2),
      distinct: ['brand']
    });

    // Popüler aramalar (trending)
    const trendingSearches = [
      'anime figür',
      'elektronik',
      'moda',
      'hediyelik',
      'ev yaşam',
      'sanat hobi',
      'koleksiyon',
      'oyuncak'
    ].filter(term => term.toLowerCase().includes(query.toLowerCase()));

    const suggestions = [
      ...productSuggestions.map(p => ({ type: 'product', text: p.title })),
      ...categorySuggestions.map(c => ({ type: 'category', text: c.category })),
      ...brandSuggestions.map(b => ({ type: 'brand', text: b.brand })),
      ...trendingSearches.map(t => ({ type: 'trending', text: t }))
    ].slice(0, limit);

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}