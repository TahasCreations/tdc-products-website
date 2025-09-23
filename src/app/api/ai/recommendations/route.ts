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

export async function POST(request: NextRequest) {
  try {
    const { currentProductId, userId, category, algorithm, limit = 6 } = await request.json();

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    let recommendations = [];

    // Algoritma türüne göre öneri sistemi
    switch (algorithm) {
      case 'collaborative':
        recommendations = await getCollaborativeRecommendations(supabase, userId, limit);
        break;
      case 'content':
        recommendations = await getContentBasedRecommendations(supabase, currentProductId, category, limit);
        break;
      case 'hybrid':
      default:
        recommendations = await getHybridRecommendations(supabase, currentProductId, userId, category, limit);
        break;
    }

    return NextResponse.json({
      success: true,
      recommendations,
      algorithm,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Öneri sistemi hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Öneriler oluşturulamadı' 
    }, { status: 500 });
  }
}

// İşbirlikçi filtreleme (Collaborative Filtering)
async function getCollaborativeRecommendations(supabase: any, userId: string | undefined, limit: number) {
  if (!userId) {
    // Kullanıcı yoksa popüler ürünleri döndür
    const { data: popularProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return popularProducts || [];
  }

  // Kullanıcının geçmiş siparişlerini al
  const { data: userOrders } = await supabase
    .from('orders')
    .select(`
      order_items (
        product_id,
        products (
          id,
          title,
          price,
          image_url,
          category,
          rating,
          reviews_count,
          slug
        )
      )
    `)
    .eq('user_id', userId);

  if (!userOrders || userOrders.length === 0) {
    // Sipariş geçmişi yoksa popüler ürünleri döndür
    const { data: popularProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return popularProducts || [];
  }

  // Kullanıcının satın aldığı kategorileri bul
  const purchasedCategories = new Set();
  userOrders.forEach(order => {
    order.order_items.forEach((item: any) => {
      if (item.products) {
        purchasedCategories.add(item.products.category);
      }
    });
  });

  // Benzer kategorilerdeki ürünleri öner
  const { data: recommendations } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .in('category', Array.from(purchasedCategories))
    .order('rating', { ascending: false })
    .limit(limit);

  return recommendations || [];
}

// İçerik tabanlı filtreleme (Content-Based Filtering)
async function getContentBasedRecommendations(supabase: any, currentProductId: string | undefined, category: string | undefined, limit: number) {
  if (!currentProductId && !category) {
    // Mevcut ürün veya kategori yoksa popüler ürünleri döndür
    const { data: popularProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(limit);
    
    return popularProducts || [];
  }

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (currentProductId) {
    // Mevcut ürünün kategorisini al
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category')
      .eq('id', currentProductId)
      .single();

    if (currentProduct) {
      query = query.eq('category', currentProduct.category).neq('id', currentProductId);
    }
  } else if (category) {
    query = query.eq('category', category);
  }

  const { data: recommendations } = await query
    .order('rating', { ascending: false })
    .limit(limit);

  return recommendations || [];
}

// Hibrit filtreleme (Hybrid Filtering)
async function getHybridRecommendations(supabase: any, currentProductId: string | undefined, userId: string | undefined, category: string | undefined, limit: number) {
  // Hem işbirlikçi hem de içerik tabanlı önerileri al
  const [collaborativeRecs, contentRecs] = await Promise.all([
    getCollaborativeRecommendations(supabase, userId, Math.ceil(limit / 2)),
    getContentBasedRecommendations(supabase, currentProductId, category, Math.ceil(limit / 2))
  ]);

  // Önerileri birleştir ve tekrarları kaldır
  const allRecommendations = [...collaborativeRecs, ...contentRecs];
  const uniqueRecommendations = allRecommendations.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );

  // Limit'e göre kes
  return uniqueRecommendations.slice(0, limit);
}
