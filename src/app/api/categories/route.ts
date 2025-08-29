import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const categoriesFilePath = path.join(process.cwd(), 'src/data/categories.json');

// Kategorileri getir
export async function GET() {
  try {
    return await getJSONCategories();
  } catch (error) {
    console.error('Error:', error);
    return await getJSONCategories();
  }
}

// JSON kategorileri getir
async function getJSONCategories() {
  try {
    try {
      await fs.access(categoriesFilePath);
    } catch {
      await fs.mkdir(path.dirname(categoriesFilePath), { recursive: true });
      await fs.writeFile(categoriesFilePath, JSON.stringify([], null, 2));
    }
    const data = await fs.readFile(categoriesFilePath, 'utf-8');
    const categories = JSON.parse(data);
    
    if (categories.length === 0) {
      const defaultCategories = [
        { id: '1', name: 'Anime', color: '#ec4899', icon: 'ri-gamepad-line' },
        { id: '2', name: 'Gaming', color: '#3b82f6', icon: 'ri-controller-line' },
        { id: '3', name: 'Film', color: '#8b5cf6', icon: 'ri-movie-line' },
        { id: '4', name: 'Diğer', color: '#6b7280', icon: 'ri-more-line' }
      ];
      await fs.writeFile(categoriesFilePath, JSON.stringify(defaultCategories, null, 2));
      return NextResponse.json(defaultCategories);
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('JSON categories error:', error);
    const defaultCategories = [
      { id: '1', name: 'Anime', color: '#ec4899', icon: 'ri-gamepad-line' },
      { id: '2', name: 'Gaming', color: '#3b82f6', icon: 'ri-controller-line' },
      { id: '3', name: 'Film', color: '#8b5cf6', icon: 'ri-movie-line' },
      { id: '4', name: 'Diğer', color: '#6b7280', icon: 'ri-more-line' }
    ];
    return NextResponse.json(defaultCategories);
  }
}

// Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    const categoryName = name.trim();

    try {
      try {
        await fs.access(categoriesFilePath);
      } catch {
        await fs.mkdir(path.dirname(categoriesFilePath), { recursive: true });
        await fs.writeFile(categoriesFilePath, JSON.stringify([], null, 2));
      }
      const data = await fs.readFile(categoriesFilePath, 'utf-8');
      const categories = JSON.parse(data);
      
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

      categories.push(newCategory);
      await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

      return NextResponse.json(newCategory);
    } catch (error) {
      console.error('JSON category error:', error);
      return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
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
      const data = await fs.readFile(categoriesFilePath, 'utf-8');
      const categories = JSON.parse(data);
      
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

      await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

      return NextResponse.json(categories[index]);
    } catch (error) {
      console.error('JSON category update error:', error);
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
      const data = await fs.readFile(categoriesFilePath, 'utf-8');
      const categories = JSON.parse(data);
      
      const filteredCategories = categories.filter((cat: any) => cat.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
      }

      await fs.writeFile(categoriesFilePath, JSON.stringify(filteredCategories, null, 2));

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('JSON category delete error:', error);
      return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
