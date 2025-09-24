import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Ürünleri getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        ),
        subcategory:subcategory_id (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'active');

    // Kategori filtresi
    if (category) {
      query = query.eq('category_id', category);
    }

    // Arama filtresi
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    // Sıralama
    query = query.order(sort, { ascending: order === 'asc' });

    // Sayfalama
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ürünler alınamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Ürün oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      short_description,
      price,
      compare_price,
      cost_price,
      sku,
      barcode,
      category_id,
      subcategory_id,
      brand,
      model,
      weight,
      dimensions,
      images,
      main_image,
      stock,
      low_stock_threshold,
      track_inventory,
      allow_backorder,
      is_featured,
      is_digital,
      download_url,
      seo_title,
      seo_description,
      seo_keywords,
      tags,
      attributes,
      variants
    } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Slug oluştur
    const productSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title,
        slug: productSlug,
        description,
        short_description,
        price,
        compare_price,
        cost_price,
        sku,
        barcode,
        category_id,
        subcategory_id,
        brand,
        model,
        weight,
        dimensions,
        images,
        main_image,
        stock,
        low_stock_threshold,
        track_inventory,
        allow_backorder,
        is_featured,
        is_digital,
        download_url,
        seo_title,
        seo_description,
        seo_keywords,
        tags,
        attributes,
        variants
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ 
          success: false, 
          error: 'Bu slug veya SKU zaten kullanılıyor' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Ürün oluşturulamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Ürün güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ürün ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ 
          success: false, 
          error: 'Bu slug veya SKU zaten kullanılıyor' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Ürün güncellenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Ürün sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ürün ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ürün silinemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}