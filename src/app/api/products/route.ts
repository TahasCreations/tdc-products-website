import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

// Supabase client'ları
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Admin client (service role ile)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Normal client (anon key ile)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Supabase bağlantısını kontrol et
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.SUPABASE_SERVICE_ROLE_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key' &&
         process.env.SUPABASE_SERVICE_ROLE_KEY !== 'placeholder-service-key' &&
         process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ') &&
         process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ');
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
export async function GET() {
  try {
    console.log('Supabase configured:', isSupabaseConfigured());
    
    // Supabase yapılandırılmışsa Supabase kullan, yoksa JSON dosyası
    if (isSupabaseConfigured()) {
      console.log('Using Supabase for data retrieval');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

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
      // Fallback: JSON dosyasından oku
      const data = await fs.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(data);
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
      
      // Supabase kullan (admin client ile)
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', newProduct.slug)
        .single();

      if (existingProduct) {
        return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
      }

      // Service role ile insert - RLS bypass
      const { data, error } = await supabaseAdmin
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

      if (error) {
        console.error('Supabase error:', error);
        // RLS hatası durumunda JSON fallback kullan
        console.log('Falling back to JSON storage due to Supabase error:', error.message);
        return await handleJSONFallback(newProduct);
      }

      console.log('Product created successfully in Supabase:', data.id);
      return NextResponse.json(data, { status: 201 });
    } else {
      console.log('Using JSON fallback for product creation');
      // Fallback: JSON dosyasına yaz
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
      // Supabase kullan (admin client ile)
      if (updateData.slug) {
        const { data: existingProduct } = await supabaseAdmin
          .from('products')
          .select('id')
          .eq('slug', updateData.slug)
          .neq('id', id)
          .single();

        if (existingProduct) {
          return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
        }
      }

      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }

      return NextResponse.json(data);
    } else {
      // Fallback: JSON dosyasını güncelle
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
    
    if (!id) {
      return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      // Supabase kullan (admin client ile)
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
      // Fallback: JSON dosyasından sil
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
