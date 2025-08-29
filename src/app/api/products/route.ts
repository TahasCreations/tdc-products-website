import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSupabaseClients } from '../../../../lib/supabase';

export const runtime = 'nodejs';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

// JSON fallback fonksiyonu
const handleJSONFallback = async (newProduct: any) => {
  try {
    // Dosya yoksa oluştur
    try {
      await fs.access(productsFilePath);
    } catch {
      await fs.mkdir(path.dirname(productsFilePath), { recursive: true });
      await fs.writeFile(productsFilePath, JSON.stringify([], null, 2));
    }
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
      images: newProduct.images || [], // Ensure images array is included
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
    const clients = getServerSupabaseClients();
    const isConfigured = clients.configured;
    console.log('Supabase configured:', isConfigured);
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    // Eğer Supabase yapılandırılmış ama service role (admin) anahtarı yoksa,
    // yazma JSON'a gideceği için okuma tarafını da JSON'dan yapalım (tutarlılık)
    if (isConfigured && clients.supabaseAdmin) {
      console.log('Using Supabase for data retrieval');
      if (!clients.supabase) {
        throw new Error('Supabase client not available');
      }
      const supabase = clients.supabase;
      
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
      // Dosya yoksa oluştur
      try {
        await fs.access(productsFilePath);
      } catch {
        await fs.mkdir(path.dirname(productsFilePath), { recursive: true });
        await fs.writeFile(productsFilePath, JSON.stringify([], null, 2));
      }
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
    console.log('Product data:', JSON.stringify(newProduct, null, 2));
    
    // Validasyon
    if (!newProduct.title || !newProduct.title.trim()) {
      return NextResponse.json({ error: 'Ürün adı gerekli' }, { status: 400 });
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      return NextResponse.json({ error: 'Geçerli bir fiyat girin' }, { status: 400 });
    }
    if (!newProduct.category || !newProduct.category.trim()) {
      return NextResponse.json({ error: 'Kategori gerekli' }, { status: 400 });
    }
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      return NextResponse.json({ error: 'Geçerli bir stok miktarı girin' }, { status: 400 });
    }
    
    const clients = getServerSupabaseClients();
    if (clients.configured && clients.supabaseAdmin) {
      console.log('Using Supabase for product creation');
      const supabaseAdmin = clients.supabaseAdmin;
      
      // Service role ile insert
      let { data, error } = await supabaseAdmin
        .from('products')
        .insert([{
          title: newProduct.title.trim(),
          slug: newProduct.slug || `urun-${Date.now()}`,
          price: parseFloat(newProduct.price),
          category: newProduct.category.trim(),
          stock: parseInt(newProduct.stock),
          image: newProduct.image || '',
          images: newProduct.images || null,
          description: newProduct.description || '',
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        // Eğer products tablosunda images kolonu yoksa, images olmadan tekrar dene
        const msg = (error as any)?.message || '';
        if (msg.toLowerCase().includes('images') || msg.toLowerCase().includes('column')) {
          console.log('Retrying without images field...');
          const retry = await supabaseAdmin
            .from('products')
            .insert([{
              title: newProduct.title.trim(),
              slug: newProduct.slug || `urun-${Date.now()}`,
              price: parseFloat(newProduct.price),
              category: newProduct.category.trim(),
              stock: parseInt(newProduct.stock),
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
    const updatedProduct = await request.json();
    
    if (!updatedProduct.id) {
      return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
    }
    
    const clients = getServerSupabaseClients();
    if (clients.configured && clients.supabaseAdmin) {
      const supabaseAdmin = clients.supabaseAdmin;
      
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({
          title: updatedProduct.title,
          price: parseFloat(updatedProduct.price),
          category: updatedProduct.category,
          stock: parseInt(updatedProduct.stock),
          image: updatedProduct.image,
          images: updatedProduct.images || null,
          description: updatedProduct.description,
          slug: updatedProduct.slug,
          status: updatedProduct.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedProduct.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // JSON fallback
      try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        
        const productIndex = products.findIndex((p: any) => p.id === updatedProduct.id);
        if (productIndex === -1) {
          return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        products[productIndex] = {
          ...products[productIndex],
          ...updatedProduct,
          updated_at: new Date().toISOString()
        };

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        return NextResponse.json(products[productIndex]);
      } catch (error) {
        console.error('JSON update error:', error);
        return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
      }
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
    
    const clients = getServerSupabaseClients();
    if (clients.configured && clients.supabaseAdmin) {
      const supabaseAdmin = clients.supabaseAdmin;
      
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      // JSON fallback
      try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        
        const filteredProducts = products.filter((p: any) => p.id !== id);
        
        if (filteredProducts.length === products.length) {
          return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
        }

        await fs.writeFile(productsFilePath, JSON.stringify(filteredProducts, null, 2));
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('JSON delete error:', error);
        return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
  }
}
