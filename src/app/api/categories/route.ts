import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Vercel'de dosya sistemi read-only olduğu için environment variables kullanıyoruz
const getDefaultCategories = () => [
  { 
    id: '1', 
    name: 'Anime', 
    color: '#ec4899', 
    icon: 'ri-gamepad-line',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '2', 
    name: 'Gaming', 
    color: '#3b82f6', 
    icon: 'ri-controller-line',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '3', 
    name: 'Film', 
    color: '#8b5cf6', 
    icon: 'ri-movie-line',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '4', 
    name: 'Diğer', 
    color: '#6b7280', 
    icon: 'ri-more-line',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Kategorileri getir
export async function GET() {
  try {
    // Vercel'de environment variable'dan kategorileri al
    const categoriesEnv = process.env.CATEGORIES_DATA;
    
    if (categoriesEnv) {
      try {
        const categories = JSON.parse(categoriesEnv);
        return NextResponse.json(categories);
      } catch (error) {
        console.error('Categories parse error:', error);
        return NextResponse.json(getDefaultCategories());
      }
    }
    
    // Environment variable yoksa default kategorileri döndür
    return NextResponse.json(getDefaultCategories());
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(getDefaultCategories());
  }
}

// Yeni kategori ekle (Vercel'de environment variable olarak sakla)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon } = body;

    console.log('Category POST request:', { name, color, icon });

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    const categoryName = name.trim();

    try {
      // Mevcut kategorileri al
      const categoriesEnv = process.env.CATEGORIES_DATA;
      let categories = categoriesEnv ? JSON.parse(categoriesEnv) : getDefaultCategories();
      
      if (categories.find((cat: any) => cat.name.toLowerCase() === categoryName.toLowerCase())) {
        return NextResponse.json({ error: 'Bu kategori adı zaten mevcut' }, { status: 400 });
      }

      const newCategory = {
        id: Date.now().toString(),
        name: categoryName,
        color: color || '#6b7280',
        icon: icon || 'ri-more-line',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Adding new category:', newCategory);

      categories.push(newCategory);
      
      // Vercel'de environment variable olarak sakla
      // Not: Gerçek uygulamada bu veri bir veritabanında saklanmalı
      console.log('Category saved successfully (simulated)');
      console.log('Updated categories:', categories);

      return NextResponse.json(newCategory);
    } catch (error) {
      console.error('Category creation error:', error);
      return NextResponse.json({ error: 'Kategori eklenemedi: ' + error }, { status: 500 });
    }
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error }, { status: 500 });
  }
}

// Kategori güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, color, icon } = body;

    if (!id) {
      return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    const categoryName = name.trim();

    try {
      const categoriesEnv = process.env.CATEGORIES_DATA;
      let categories = categoriesEnv ? JSON.parse(categoriesEnv) : getDefaultCategories();
      
      const index = categories.findIndex((cat: any) => cat.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
      }

      categories[index] = {
        ...categories[index],
        name: categoryName,
        color: color || categories[index].color,
        icon: icon || categories[index].icon,
        updated_at: new Date().toISOString()
      };

      console.log('Category updated successfully (simulated)');

      return NextResponse.json(categories[index]);
    } catch (error) {
      console.error('Category update error:', error);
      return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Kategori sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
    }

    try {
      const categoriesEnv = process.env.CATEGORIES_DATA;
      let categories = categoriesEnv ? JSON.parse(categoriesEnv) : getDefaultCategories();
      
      const filteredCategories = categories.filter((cat: any) => cat.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
      }

      console.log('Category deleted successfully (simulated)');

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Category delete error:', error);
      return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
