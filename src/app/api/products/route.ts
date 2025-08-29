import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../../../lib/supabase';

export const runtime = 'nodejs';

const getDefaultProducts = () => [
  {
    id: "1",
    slug: "naruto-uzumaki-figuru",
    title: "Naruto Uzumaki Figürü",
    price: 299.99,
    category: "Anime",
    stock: 15,
    image: "/uploads/naruto-figur.jpg",
    images: ["/uploads/naruto-figur.jpg", "/uploads/naruto-figur-2.jpg"],
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
    image: "/uploads/goku-figur.jpg",
    images: ["/uploads/goku-figur.jpg", "/uploads/goku-figur-2.jpg"],
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
    image: "/uploads/mario-figur.jpg",
    images: ["/uploads/mario-figur.jpg"],
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
    image: "/uploads/ironman-figur.jpg",
    images: ["/uploads/ironman-figur.jpg", "/uploads/ironman-figur-2.jpg", "/uploads/ironman-figur-3.jpg"],
    description: "Marvel Cinematic Universe'den Iron Man'in Mark 85 zırhının detaylı figürü. LED aydınlatmalı.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
];

export async function GET() {
  try {
    // Supabase'den ürünleri al
    const products = await getProducts();
    
    if (products.length > 0) {
      return NextResponse.json(products);
    }
    
    // Eğer Supabase'de ürün yoksa default ürünleri döndür
    return NextResponse.json(getDefaultProducts());
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(getDefaultProducts());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, category, stock, image, images, description, slug, action } = body;

    console.log('Product POST request:', { title, price, category, stock, action });

    if (action === 'get') {
      const products = await getProducts();
      return NextResponse.json({
        success: true,
        message: 'Supabase\'den ürünler alındı',
        products: products.length > 0 ? products : getDefaultProducts()
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
        const addedProduct = await addProduct(newProduct);
        return NextResponse.json({
          success: true,
          message: 'Ürün Supabase\'e eklendi',
          product: addedProduct,
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

      try {
        const updatedProduct = await updateProduct(id, updates);
        return NextResponse.json({
          success: true,
          message: 'Ürün güncellendi',
          product: updatedProduct
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

      try {
        await deleteProduct(id);
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
