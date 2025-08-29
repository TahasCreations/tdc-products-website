import { NextRequest, NextResponse } from 'next/server';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../../../lib/supabase';

export const runtime = 'nodejs';

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

export async function GET() {
  try {
    // Supabase'den kategorileri al
    const categories = await getCategories();
    
    if (categories.length > 0) {
      return NextResponse.json(categories);
    }
    
    // Eğer Supabase'de kategori yoksa default kategorileri döndür
    return NextResponse.json(getDefaultCategories());
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(getDefaultCategories());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon, action } = body;

    console.log('Category POST request:', { name, color, icon, action });

    if (action === 'get') {
      const categories = await getCategories();
      return NextResponse.json({
        success: true,
        message: 'Supabase\'den kategoriler alındı',
        categories: categories.length > 0 ? categories : getDefaultCategories()
      });
    }

    if (action === 'add') {
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
      }

      const categoryName = name.trim();

      const newCategory = {
        name: categoryName,
        color: color || '#6b7280',
        icon: icon || 'ri-more-line'
      };

      console.log('Adding new category to Supabase:', newCategory);

      try {
        const addedCategory = await addCategory(newCategory);
        return NextResponse.json({
          success: true,
          message: 'Kategori Supabase\'e eklendi',
          category: addedCategory,
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
        return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
      }

      try {
        const updatedCategory = await updateCategory(id, updates);
        return NextResponse.json({
          success: true,
          message: 'Kategori güncellendi',
          category: updatedCategory
        });
      } catch (supabaseError) {
        console.error('Supabase update error:', supabaseError);
        return NextResponse.json({ error: 'Güncelleme hatası: ' + supabaseError }, { status: 500 });
      }
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
      }

      try {
        await deleteCategory(id);
        return NextResponse.json({
          success: true,
          message: 'Kategori silindi'
        });
      } catch (supabaseError) {
        console.error('Supabase delete error:', supabaseError);
        return NextResponse.json({ error: 'Silme hatası: ' + supabaseError }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error }, { status: 500 });
  }
}
