import { NextRequest, NextResponse } from 'next/server';
import { hybridStorageManager } from '../../../../lib/hybrid-storage-manager';

export const dynamic = 'force-dynamic';

// Hibrit ürün yönetimi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let products = await hybridStorageManager.getProducts();

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

    // Sıralama
    products.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Sayfalama
    const total = products.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Sync status bilgisi
    const syncStatus = hybridStorageManager.getSyncStatus();

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      syncStatus,
      isHybrid: true
    });

  } catch (error) {
    console.error('Hybrid get products error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Ürünler alınamadı' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...data } = body;

    if (action === 'add') {
      const {
        title,
        price,
        category,
        subcategory,
        stock,
        image,
        images,
        description,
        slug
      } = data;

      if (!title || !price || !category) {
        return NextResponse.json({ 
          success: false, 
          error: 'Başlık, fiyat ve kategori gerekli' 
        }, { status: 400 });
      }

      const productSlug = slug || title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newProduct = await hybridStorageManager.addProduct({
        name: title,
        title: title,
        price: parseFloat(price),
        category: category,
        subcategory: subcategory || undefined,
        stock: parseInt(stock) || 0,
        status: 'active',
        image: image || '',
        images: images || [],
        description: description || '',
        slug: productSlug
      });

      const syncStatus = hybridStorageManager.getSyncStatus();

      return NextResponse.json({
        success: true,
        product: newProduct,
        message: 'Ürün başarıyla eklendi (Local + Cloud)',
        syncStatus
      });

    } else if (action === 'update') {
      if (!id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün ID gerekli' 
        }, { status: 400 });
      }

      const updatedProduct = await hybridStorageManager.updateProduct(id, data);
      
      if (!updatedProduct) {
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün bulunamadı' 
        }, { status: 404 });
      }

      const syncStatus = hybridStorageManager.getSyncStatus();

      return NextResponse.json({
        success: true,
        product: updatedProduct,
        message: 'Ürün başarıyla güncellendi (Local + Cloud)',
        syncStatus
      });

    } else if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün ID gerekli' 
        }, { status: 400 });
      }

      const deleted = await hybridStorageManager.deleteProduct(id);
      
      if (!deleted) {
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün bulunamadı' 
        }, { status: 404 });
      }

      const syncStatus = hybridStorageManager.getSyncStatus();

      return NextResponse.json({
        success: true,
        message: 'Ürün başarıyla silindi (Local + Cloud)',
        syncStatus
      });

    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz işlem' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Hybrid product operation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Sunucu hatası' 
    }, { status: 500 });
  }
}
