import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

// Supabase client'larını lazy olarak oluştur
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  return {
    supabase: createClient(supabaseUrl, supabaseAnonKey),
    supabaseAdmin: createClient(supabaseUrl, supabaseServiceKey)
  };
};

// Supabase bağlantısını kontrol et
const isSupabaseConfigured = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl.startsWith('https://') &&
         supabaseAnonKey.startsWith('eyJ');
};

// JSON fallback fonksiyonu
const handleJSONFallback = async (newProduct: any) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(data);
    
    const newId = Date.now().toString();
    const productWithId = {
      id: newId,
      slug: newProduct.slug || `urun-${newId}`,
      title: newProduct.title || '',
      price: parseFloat(newProduct.price) || 0,
      category: newProduct.category || 'Diğer',
      stock: parseInt(newProduct.stock) || 0,
      image: newProduct.image || '',
      description: newProduct.description || '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    products.push(productWithId);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(productWithId, { status: 201 });
  } catch (error) {
    console.error('JSON fallback error:', error);
    return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
  }
};

// GET: Tüm ürünleri getir
export async function GET(request: NextRequest) {
  try {
    console.log('Supabase configured:', isSupabaseConfigured());
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (isSupabaseConfigured()) {
      console.log('Using Supabase for data retrieval');
      
      const { supabase } = createSupabaseClient();
      
      if (slug) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(data);
      }

      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        // Supabase hatası durumunda JSON fallback kullan
        console.log('Falling back to JSON due to Supabase error');
        const jsonData = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(jsonData);
        return NextResponse.json(products);
      }

      console.log('Supabase data retrieved successfully:', data?.length || 0, 'products');
      return NextResponse.json(data || []);
    } else {
      console.log('Using JSON fallback - Supabase not configured');
      const data = await fs.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(data);
      if (slug) {
        const product = products.find((p: any) => p.slug === slug);
        if (!product) {
          return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }
        return NextResponse.json(product);
      }
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
  }
}

// POST: Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json();
    console.log('Adding new product:', newProduct.title);
    
    if (isSupabaseConfigured()) {
      console.log('Using Supabase for product creation');
      
      const { supabaseAdmin } = createSupabaseClient();
      
      // Service role ile insert
      let { data, error } = await supabaseAdmin
        .from('products')
        .insert([{
          title: newProduct.title || '',
          slug: newProduct.slug || `urun-${Date.now()}`,
          price: parseFloat(newProduct.price) || 0,
          category: newProduct.category || 'Diğer',
          stock: parseInt(newProduct.stock) || 0,
          image: newProduct.image || '',
          images: (newProduct as any).images || null,
          description: newProduct.description || '',
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        // Eğer products tablosunda images kolonu yoksa, images olmadan tekrar dene
        const msg = (error as any)?.message || '';
        if (msg.toLowerCase().includes('images') || msg.toLowerCase().includes('column')) {
          const retry = await supabaseAdmin
            .from('products')
            .insert([{
              title: newProduct.title || '',
              slug: newProduct.slug || `urun-${Date.now()}`,
              price: parseFloat(newProduct.price) || 0,
              category: newProduct.category || 'Diğer',
              stock: parseInt(newProduct.stock) || 0,
              image: newProduct.image || '',
              description: newProduct.description || '',
              status: 'active'
            }])
            .select()
            .single();
          if (retry.error) {
            console.error('Supabase retry error:', retry.error);
            console.log('Falling back to JSON storage due to Supabase error:', retry.error.message);
            return await handleJSONFallback(newProduct);
          }
          data = retry.data as any;
        } else {
          console.error('Supabase error:', error);
          console.log('Falling back to JSON storage due to Supabase error:', msg);
          return await handleJSONFallback(newProduct);
        }
      }

      console.log('Product created successfully in Supabase:', data.id);
      return NextResponse.json(data, { status: 201 });
    } else {
      console.log('Using JSON fallback for product creation');
      return await handleJSONFallback(newProduct);
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
  }
}

// PUT: Ürün güncelle
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (isSupabaseConfigured()) {
      const { supabaseAdmin } = createSupabaseClient();
      
      let { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const msg = (error as any)?.message || '';
        if ((updateData as any)?.images && (msg.toLowerCase().includes('images') || msg.toLowerCase().includes('column'))) {
          const { images, ...rest } = (updateData as any);
          const retry = await supabaseAdmin
            .from('products')
            .update(rest)
            .eq('id', id)
            .select()
            .single();
          if (retry.error) {
            console.error('Supabase retry update error:', retry.error);
            return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
          }
          data = retry.data as any;
        } else {
          console.error('Supabase error:', error);
          return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
        }
      }

      if (!data) {
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }

      return NextResponse.json(data);
    } else {
      const data = await fs.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(data);
      
      const productIndex = products.findIndex((p: any) => p.id === id);
      if (productIndex === -1) {
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }
      
      products[productIndex] = { ...products[productIndex], ...updateData };
      await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
      
      return NextResponse.json(products[productIndex]);
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

// DELETE: Ürün sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const bulk = searchParams.get('bulk');
    const token = request.headers.get('x-admin-token') || '';
    
    if (!id && !bulk) {
      return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { supabaseAdmin } = createSupabaseClient();
      
      if (bulk === 'true') {
        // Simple header-based token check to protect bulk delete
        const expected = process.env.ADMIN_CLEANUP_TOKEN || '';
        if (!expected || token !== expected) {
          return NextResponse.json({ error: 'Yetkisiz istek' }, { status: 401 });
        }
        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .neq('id', '');
        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json({ error: 'Toplu silme başarısız' }, { status: 500 });
        }
        return NextResponse.json({ message: 'Tüm ürünler silindi' });
      }

      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Ürün silindi' });
    } else {
      const data = await fs.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(data);
      
      const filteredProducts = products.filter((p: any) => p.id !== id);
      await fs.writeFile(productsFilePath, JSON.stringify(filteredProducts, null, 2));
      
      return NextResponse.json({ message: 'Ürün silindi' });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
  }
}
