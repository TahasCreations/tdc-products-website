import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Vercel'de dosya sistemi read-only olduğu için client-side storage kullanıyoruz
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
    description: "Dragon Ball serisinin efsanevi karakteri Goku'nun Super Saiyan formundaki detaylı figürü. Koleksiyoncular için özel üretim.",
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
    description: "Nintendo'nun efsanevi karakteri Mario'nun 3D baskı figürü. Oyun dünyasının en sevilen karakterlerinden biri.",
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
    description: "Marvel Cinematic Universe'den Iron Man'in Mark 85 zırhının detaylı figürü. LED aydınlatmalı özel versiyon.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
];

// Ürünleri getir
export async function GET() {
  try {
    // Vercel'de environment variable'dan ürünleri al
    const productsEnv = process.env.PRODUCTS_DATA;
    
    if (productsEnv) {
      try {
        const products = JSON.parse(productsEnv);
        return NextResponse.json(products);
      } catch (error) {
        console.error('Products parse error:', error);
        return NextResponse.json(getDefaultProducts());
      }
    }
    
    // Environment variable yoksa default ürünleri döndür
    return NextResponse.json(getDefaultProducts());
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(getDefaultProducts());
  }
}

// Yeni ürün ekle (Client-side storage için özel endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, category, stock, image, images, description, slug, action } = body;

    console.log('Product POST request:', { title, price, category, stock, action });

    // Client-side storage işlemleri için özel action
    if (action === 'get') {
      // Mevcut ürünleri döndür (client-side'dan alınacak)
      return NextResponse.json({ 
        success: true, 
        message: 'Client-side storage kullanılıyor',
        products: getDefaultProducts()
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
        id: Date.now().toString(),
        slug: productSlug,
        title: title.trim(),
        price: parseFloat(price),
        category: category.trim(),
        stock: parseInt(stock),
        image: image || (images && images.length > 0 ? images[0] : ''),
        images: images || [],
        description: description ? description.trim() : '',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Adding new product:', newProduct);

      // Client-side storage için başarı mesajı
      return NextResponse.json({
        success: true,
        message: 'Ürün client-side storage\'a eklendi',
        product: newProduct,
        storageType: 'localStorage'
      });
    }

    // Eski yöntem (environment variable)
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

    try {
      // Mevcut ürünleri al
      const productsEnv = process.env.PRODUCTS_DATA;
      let products = productsEnv ? JSON.parse(productsEnv) : getDefaultProducts();
      
      const productSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      if (products.find((prod: any) => prod.slug === productSlug)) {
        return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
      }

      const newProduct = {
        id: Date.now().toString(),
        slug: productSlug,
        title: title.trim(),
        price: parseFloat(price),
        category: category.trim(),
        stock: parseInt(stock),
        image: image || (images && images.length > 0 ? images[0] : ''),
        images: images || [],
        description: description ? description.trim() : '',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Adding new product:', newProduct);

      products.push(newProduct);
      
      // Vercel'de environment variable olarak sakla
      // Not: Gerçek uygulamada bu veri bir veritabanında saklanmalı
      console.log('Product saved successfully (simulated)');
      console.log('Updated products:', products);

      return NextResponse.json(newProduct);
    } catch (error) {
      console.error('Product creation error:', error);
      return NextResponse.json({ error: 'Ürün eklenemedi: ' + error }, { status: 500 });
    }
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error }, { status: 500 });
  }
}

// Ürün güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, price, category, stock, image, images, description, slug } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
    }

    try {
      const productsEnv = process.env.PRODUCTS_DATA;
      let products = productsEnv ? JSON.parse(productsEnv) : getDefaultProducts();
      
      const index = products.findIndex((prod: any) => prod.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }

      products[index] = {
        ...products[index],
        title: title ? title.trim() : products[index].title,
        price: price ? parseFloat(price) : products[index].price,
        category: category ? category.trim() : products[index].category,
        stock: stock ? parseInt(stock) : products[index].stock,
        image: image || products[index].image,
        images: images || products[index].images,
        description: description ? description.trim() : products[index].description,
        slug: slug || products[index].slug,
        updated_at: new Date().toISOString()
      };

      console.log('Product updated successfully (simulated)');

      return NextResponse.json(products[index]);
    } catch (error) {
      console.error('Product update error:', error);
      return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Ürün sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Ürün ID gerekli' }, { status: 400 });
    }

    try {
      const productsEnv = process.env.PRODUCTS_DATA;
      let products = productsEnv ? JSON.parse(productsEnv) : getDefaultProducts();
      
      const filteredProducts = products.filter((prod: any) => prod.id !== id);
      
      if (filteredProducts.length === products.length) {
        return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
      }

      console.log('Product deleted successfully (simulated)');

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Product delete error:', error);
      return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
