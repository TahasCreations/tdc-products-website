import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Default wishlist data
const getDefaultWishlist = () => [
  {
    id: '1',
    product_id: '1',
    created_at: '2024-01-15T10:00:00.000Z',
    product: {
      id: '1',
      title: 'Naruto Uzumaki Figürü',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      slug: 'naruto-uzumaki-figuru',
      category: 'Anime',
      stock: 15
    }
  },
  {
    id: '2',
    product_id: '2',
    created_at: '2024-01-14T15:30:00.000Z',
    product: {
      id: '2',
      title: 'Goku Super Saiyan Figürü',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop',
      slug: 'goku-super-saiyan-figuru',
      category: 'Anime',
      stock: 8
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Supabase URL kontrolü
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.includes('your_supabase_project_url') ||
        !supabaseUrl.startsWith('https://')) {
      return NextResponse.json({ wishlistItems: getDefaultWishlist() });
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    // Kullanıcı kontrolü
    const { data: { user }, error: authError } = await supabase!.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ wishlistItems: getDefaultWishlist() });
    }

    // Wishlist'i getir
    const { data: wishlistItems, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        product_id,
        created_at,
        product:products (
          id,
          title,
          price,
          image,
          slug,
          category,
          stock
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Wishlist fetch error:', error);
      return NextResponse.json({ wishlistItems: getDefaultWishlist() });
    }

    if (wishlistItems && wishlistItems.length > 0) {
      return NextResponse.json({ wishlistItems });
    }

    // Eğer Supabase'de wishlist yoksa default wishlist'i döndür
    return NextResponse.json({ wishlistItems: getDefaultWishlist() });
  } catch (error) {
    console.error('Wishlist API error:', error);
    return NextResponse.json({ wishlistItems: getDefaultWishlist() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Supabase URL kontrolü
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.includes('your_supabase_project_url') ||
        !supabaseUrl.startsWith('https://')) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { productId } = await request.json();

    // Kullanıcı kontrolü
    const { data: { user }, error: authError } = await supabase!.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ürün kontrolü
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Ürünün var olup olmadığını kontrol et
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Wishlist'e ekle
    const { data, error } = await supabase
      .from('wishlists')
      .insert([
        {
          user_id: user.id,
          product_id: productId
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Product already in wishlist' }, { status: 409 });
      }
      console.error('Add to wishlist error:', error);
      return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error('Add to wishlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Supabase URL kontrolü
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.includes('your_supabase_project_url') ||
        !supabaseUrl.startsWith('https://')) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    // Kullanıcı kontrolü
    const { data: { user }, error: authError } = await supabase!.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ürün kontrolü
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Wishlist'ten çıkar
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Remove from wishlist error:', error);
      return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove from wishlist API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

