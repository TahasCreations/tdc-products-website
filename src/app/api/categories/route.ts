import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSupabaseClients } from '../../../../lib/supabase';

const categoriesFilePath = path.join(process.cwd(), 'src/data/categories.json');

const isSupabaseConfigured = () => {
  const clients = getServerSupabaseClients();
  return clients.configured;
};

// Kategorileri getir
export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const clients = getServerSupabaseClients();
      if (!clients.configured || !clients.supabase) {
        throw new Error('Supabase not configured');
      }
      const { data, error } = await clients.supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Kategoriler yüklenemedi' }, { status: 500 });
      }

      return NextResponse.json(data || []);
    } else {
      // JSON fallback
      try {
        const data = await fs.readFile(categoriesFilePath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
      } catch (error) {
        // Varsayılan kategoriler
        const defaultCategories = [
          { id: '1', name: 'Anime', color: '#ec4899', icon: 'ri-gamepad-line' },
          { id: '2', name: 'Gaming', color: '#3b82f6', icon: 'ri-controller-line' },
          { id: '3', name: 'Film', color: '#8b5cf6', icon: 'ri-movie-line' },
          { id: '4', name: 'Diğer', color: '#6b7280', icon: 'ri-more-line' }
        ];
        return NextResponse.json(defaultCategories);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      // Kategori adının benzersiz olduğunu kontrol et
      const clients = getServerSupabaseClients();
      if (!clients.configured || !clients.supabase) {
        throw new Error('Supabase not configured');
      }
      const { data: existingCategory } = await clients.supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .single();

      if (existingCategory) {
        return NextResponse.json({ error: 'Bu kategori adı zaten mevcut' }, { status: 400 });
      }

      const { supabaseAdmin } = getServerSupabaseClients();
      const { data, error } = await (supabaseAdmin as any)
        .from('categories')
        .insert([{
          name,
          color: color || '#6b7280',
          icon: icon || 'ri-more-line'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // JSON fallback
      try {
        const data = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories = JSON.parse(data);
        
        // Kategori adının benzersiz olduğunu kontrol et
        if (categories.find((cat: any) => cat.name === name)) {
          return NextResponse.json({ error: 'Bu kategori adı zaten mevcut' }, { status: 400 });
        }

        const newCategory = {
          id: Date.now().toString(),
          name,
          color: color || '#6b7280',
          icon: icon || 'ri-more-line'
        };

        categories.push(newCategory);
        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

        return NextResponse.json(newCategory);
      } catch (error) {
        console.error('JSON error:', error);
        return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Kategori güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, color, icon } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'Kategori ID ve adı gerekli' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { supabaseAdmin } = getServerSupabaseClients();
      const { data, error } = await (supabaseAdmin as any)
        .from('categories')
        .update({
          name,
          color: color || '#6b7280',
          icon: icon || 'ri-more-line'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // JSON fallback
      try {
        const data = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories = JSON.parse(data);
        
        const categoryIndex = categories.findIndex((cat: any) => cat.id === id);
        if (categoryIndex === -1) {
          return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
        }

        categories[categoryIndex] = {
          ...categories[categoryIndex],
          name,
          color: color || '#6b7280',
          icon: icon || 'ri-more-line'
        };

        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

        return NextResponse.json(categories[categoryIndex]);
      } catch (error) {
        console.error('JSON error:', error);
        return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Kategori sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const bulk = searchParams.get('bulk');
    const token = request.headers.get('x-admin-token') || '';

    if (!id && !bulk) {
      return NextResponse.json({ error: 'Kategori ID gerekli' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      if (bulk === 'true') {
        const expected = process.env.ADMIN_CLEANUP_TOKEN || '';
        if (!expected || token !== expected) {
          return NextResponse.json({ error: 'Yetkisiz istek' }, { status: 401 });
        }
        const { supabaseAdmin } = getServerSupabaseClients();
        const { error } = await (supabaseAdmin as any)
          .from('categories')
          .delete()
          .neq('id', '');
        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json({ error: 'Toplu silme başarısız' }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }

      const { supabaseAdmin } = getServerSupabaseClients();
      const { error } = await (supabaseAdmin as any)
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      // JSON fallback
      try {
        const data = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories = JSON.parse(data);
        
        const filteredCategories = categories.filter((cat: any) => cat.id !== id);
        
        if (filteredCategories.length === categories.length) {
          return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
        }

        await fs.writeFile(categoriesFilePath, JSON.stringify(filteredCategories, null, 2));

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('JSON error:', error);
        return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
