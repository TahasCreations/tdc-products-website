import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
      images: newProduct.images || [],
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
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    return await getJSONProducts(slug);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
  }
}

// JSON ürünleri getir
async function getJSONProducts(slug: string | null) {
  try {
    await fs.access(productsFilePath);
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
  } catch (error) {
    console.error('JSON products error:', error);
    return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
  }
}

// POST: Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json();
    return await handleJSONFallback(newProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// PUT: Ürün güncelle
export async function PUT(request: NextRequest) {
  try {
    const updatedProduct = await request.json();
    
    if (!updatedProduct.id) {
      return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
    }
    
    const data = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(data);
    
    const index = products.findIndex((p: any) => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }
    
    products[index] = {
      ...products[index],
      ...updatedProduct,
      updated_at: new Date().toISOString()
    };
    
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(products[index]);
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
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
    
    const data = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(data);
    
    const filteredProducts = products.filter((p: any) => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }
    
    await fs.writeFile(productsFilePath, JSON.stringify(filteredProducts, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
