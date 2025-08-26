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
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Normal client (anon key ile)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase bağlantısını kontrol et
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

// GET: Tüm ürünleri getir
export async function GET() {
  try {
    // Supabase yapılandırılmışsa Supabase kullan, yoksa JSON dosyası
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
      }

      return NextResponse.json(data || []);
    } else {
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
    
    if (isSupabaseConfigured()) {
      // Supabase kullan (admin client ile)
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', newProduct.slug)
        .single();

      if (existingProduct) {
        return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([{
          title: newProduct.title,
          slug: newProduct.slug,
          price: newProduct.price,
          category: newProduct.category,
          stock: newProduct.stock,
          image: newProduct.image,
          description: newProduct.description,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    } else {
      // Fallback: JSON dosyasına yaz
      const data = await fs.readFile(productsFilePath, 'utf-8');
      const products = JSON.parse(data);
      
      const newId = Date.now().toString();
      const productWithId = {
        id: newId,
        slug: newProduct.slug || `urun-${newId}`,
        ...newProduct
      };
      
      products.push(productWithId);
      await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
      
      return NextResponse.json(productWithId, { status: 201 });
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
