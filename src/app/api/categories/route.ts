import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

const getDefaultCategories = () => [
  {
    id: '1',
    name: 'Anime',
    color: '#ec4899',
    icon: 'ri-gamepad-line',
    parent_id: null,
    level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Gaming',
    color: '#3b82f6',
    icon: 'ri-controller-line',
    parent_id: null,
    level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Film',
    color: '#8b5cf6',
    icon: 'ri-movie-line',
    parent_id: null,
    level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Diğer',
    color: '#6b7280',
    icon: 'ri-more-line',
    parent_id: null,
    level: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(getDefaultCategories());
    }
    
    // Supabase'den kategorileri al
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase categories error:', error);
      return NextResponse.json(getDefaultCategories());
    }
    
    if (categories && categories.length > 0) {
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

    // Category POST request

    if (action === 'get') {
      const supabase = createServerSupabaseClient();
      if (!supabase) {
        return NextResponse.json({
          success: true,
          message: 'Default kategoriler kullanılıyor',
          categories: getDefaultCategories()
        });
      }
      
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase get categories error:', error);
        return NextResponse.json({
          success: true,
          message: 'Default kategoriler kullanılıyor',
          categories: getDefaultCategories()
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Supabase\'den kategoriler alındı',
        categories: categories && categories.length > 0 ? categories : getDefaultCategories()
      });
    }

    if (action === 'add') {
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
      }

      const categoryName = name.trim();
      const { parent_id } = body;

      const newCategory = {
        name: categoryName,
        color: color || '#6b7280',
        icon: icon || 'ri-more-line',
        parent_id: parent_id || null,
        level: parent_id ? 1 : 0
      };

      // Adding new category to Supabase

      try {
        const supabase = createServerSupabaseClient();
        if (!supabase) {
          return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
        }
        
        const { data, error } = await supabase
          .from('categories')
          .insert([newCategory])
          .select()
          .single();
          
        if (error) {
          console.error('Supabase add category error:', error);
          return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Kategori Supabase\'e eklendi',
          category: data,
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
        const supabase = createServerSupabaseClient();
        if (!supabase) {
          return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
        }
        
        const { data, error } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error('Supabase update category error:', error);
          return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Kategori güncellendi',
          category: data
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
        const supabase = createServerSupabaseClient();
        if (!supabase) {
          return NextResponse.json({ error: 'Supabase bağlantısı kurulamadı' }, { status: 500 });
        }
        
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Supabase delete category error:', error);
          return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
        }
        
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
