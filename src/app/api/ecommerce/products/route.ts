import { NextRequest, NextResponse } from 'next/server';
import { fileStorageManager } from '../../../../lib/file-storage-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let products = await fileStorageManager.getProducts();

    // Kategori filtresi
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // Arama filtresi
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // En yeni ürünler önce
    products.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Limit uygula
    const limitedProducts = products.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedProducts
    });

  } catch (error) {
    console.error('Ecommerce products error:', error);
    return NextResponse.json({
      success: false,
      error: 'Ürünler alınamadı'
    }, { status: 500 });
  }
}