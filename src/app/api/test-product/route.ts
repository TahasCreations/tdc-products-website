import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json();
    
    console.log('Gelen ürün verisi:', newProduct);
    
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
      title: newProduct.title.trim(),
      price: parseFloat(newProduct.price),
      category: newProduct.category.trim(),
      stock: parseInt(newProduct.stock),
      image: newProduct.image || '',
      images: newProduct.images || [],
      description: newProduct.description || '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Eklenen ürün:', productWithId);
    
    products.push(productWithId);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(productWithId, { status: 201 });
  } catch (error) {
    console.error('Test product API error:', error);
    return NextResponse.json({ error: 'Ürün eklenemedi', details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    try {
      await fs.access(productsFilePath);
    } catch {
      await fs.mkdir(path.dirname(productsFilePath), { recursive: true });
      await fs.writeFile(productsFilePath, JSON.stringify([], null, 2));
    }
    
    const data = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(data);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Test product GET error:', error);
    return NextResponse.json({ error: 'Ürünler yüklenemedi' }, { status: 500 });
  }
}
