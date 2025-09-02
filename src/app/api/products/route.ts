import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

const getDefaultProducts = () => [
  {
    id: "1",
    slug: "naruto-uzumaki-figuru",
    title: "Naruto Uzumaki Figürü",
    price: 299.99,
    category: "Anime",
    stock: 15,
    image: "",
    images: [],
    description: "Naruto anime serisinin baş karakteri olan Naruto Uzumaki'nin detaylı 3D baskı figürü. Yüksek kaliteli malzemelerle üretilmiştir.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    slug: "goku-super-saiyan-figuru",
    title: "Goku Super Saiyan Figürü",
    price: 349.99,
    category: "Anime",
    stock: 8,
    image: "",
    images: [],
    description: "Dragon Ball serisinin efsanevi karakteri Goku'nun Super Saiyan formundaki detaylı figürü. Koleksiyon değeri yüksek.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "3",
    slug: "mario-bros-figuru",
    title: "Mario Bros Figürü",
    price: 199.99,
    category: "Gaming",
    stock: 25,
    image: "",
    images: [],
    description: "Nintendo'nun efsanevi karakteri Mario'nun 3D baskı figürü. Oyun dünyasının en sevilen karakteri.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "4",
    slug: "iron-man-mark-85-figuru",
    title: "Iron Man Mark 85 Figürü",
    price: 449.99,
    category: "Film",
    stock: 5,
    image: "",
    images: [],
    description: "Marvel Cinematic Universe'den Iron Man'in Mark 85 zırhının detaylı figürü. LED aydınlatmalı.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    console.log('API: Ürünler isteniyor...', slug ? `(slug: ${slug})` : '');
    
    // Eğer slug parametresi varsa, tek ürün getir
    if (slug) {
      try {
        const supabase = createServerSupabaseClient();
        if (!supabase) {
          return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Single product fetch error:', error);
          // Default ürünlerden slug'a uygun olanı bul
          const defaultProduct = getDefaultProducts().find(p => p.slug === slug);
          if (defaultProduct) {
            return NextResponse.json(defaultProduct, {
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
          }
          return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        console.log('API: Tek ürün bulundu:', data.title);
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.error('Single product error:', error);
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }
    }
    
    // Supabase'den tüm ürünleri al
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('All products fetch error:', error);
      return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 });
    }
    
    console.log('API: Supabase\'den', data.length, 'ürün alındı');
    
    if (data.length > 0) {
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    // Eğer Supabase'de ürün yoksa default ürünleri döndür
    console.log('API: Default ürünler döndürülüyor');
    return NextResponse.json(getDefaultProducts(), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(getDefaultProducts(), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, category, stock, image, images, description, slug, action } = body;

    console.log('Product POST request:', { title, price, category, stock, action });

    if (action === 'get') {
      const supabase = createServerSupabaseClient();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
      }
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) {
        console.error('Supabase get all error:', error);
        return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        message: 'Supabase\'den ürünler alındı',
        products: data.length > 0 ? data : getDefaultProducts()
      });
    }

    if (action === 'add') {
      if (!title || !title.trim()) {
        return NextResponse.json({ error: 'Ürün adı gerekli' }, { status: 400 });
      }
      if (!price || isNaN(parseFloat(price))) {
        return NextResponse.json({ error: 'Geçerli fiyat gerekli' }, { status: 400 });
      }
      if (!category || !category.trim()) {
        return NextResponse.json({ error: 'Kategori gerekli' }, { status: 400 });
      }
      if (!stock || isNaN(parseInt(stock))) {
        return NextResponse.json({ error: 'Geçerli stok miktarı gerekli' }, { status: 400 });
      }

      const supabase = createServerSupabaseClient();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
      }

      const productSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const newProduct = {
        slug: productSlug,
        title: title.trim(),
        price: parseFloat(price),
        category: category.trim(),
        stock: parseInt(stock),
        image: image || (images && images.length > 0 ? images[0] : ''),
        images: images || [],
        description: description ? description.trim() : '',
        status: 'active'
      };

      console.log('Adding new product to Supabase:', newProduct);

      try {
        const { data, error } = await supabase
          .from('products')
          .insert([newProduct])
          .select()
          .single();

        if (error) {
          console.error('Supabase add product error:', error);
          return NextResponse.json({ error: 'Ürün Supabase\'e eklenemedi' }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          message: 'Ürün Supabase\'e eklendi',
          product: data,
          storageType: 'supabase'
        });
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        return NextResponse.json({ error: 'Supabase hatası: ' + supabaseError }, { status: 500 });
      }
    }

    if (action === 'update') {
      const { id, ...updates } = body;
      if (!id) {
        return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
      }

      const supabase = createServerSupabaseClient();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Supabase update product error:', error);
          return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          message: 'Ürün güncellendi',
          product: data
        });
      } catch (supabaseError) {
        console.error('Supabase update error:', supabaseError);
        return NextResponse.json({ error: 'Güncelleme hatası: ' + supabaseError }, { status: 500 });
      }
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
      }

      const supabase = createServerSupabaseClient();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
      }

      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete product error:', error);
          return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          message: 'Ürün silindi'
        });
      } catch (supabaseError) {
        console.error('Supabase delete error:', supabaseError);
        return NextResponse.json({ error: 'Silme hatası: ' + supabaseError }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error }, { status: 500 });
  }
}
