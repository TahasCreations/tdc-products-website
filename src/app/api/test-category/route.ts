import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const categoriesFilePath = path.join(process.cwd(), 'src/data/categories.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon } = body;

    console.log('Test category request:', { name, color, icon });

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    const categoryName = name.trim();

    try {
      // Dosya yolunu kontrol et
      console.log('Categories file path:', categoriesFilePath);
      
      // Dizin var mı kontrol et
      const dirPath = path.dirname(categoriesFilePath);
      console.log('Directory path:', dirPath);
      
      try {
        await fs.access(dirPath);
        console.log('Directory exists');
      } catch {
        console.log('Creating directory...');
        await fs.mkdir(dirPath, { recursive: true });
      }

      // Dosya var mı kontrol et
      try {
        await fs.access(categoriesFilePath);
        console.log('File exists');
      } catch {
        console.log('Creating file...');
        await fs.writeFile(categoriesFilePath, JSON.stringify([], null, 2));
      }

      const data = await fs.readFile(categoriesFilePath, 'utf-8');
      console.log('File content:', data);
      
      const categories = JSON.parse(data);
      console.log('Parsed categories:', categories);
      
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

      console.log('New category:', newCategory);

      categories.push(newCategory);
      await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

      console.log('Category saved successfully');

      return NextResponse.json(newCategory);
    } catch (error) {
      console.error('JSON category error:', error);
      return NextResponse.json({ error: 'Kategori eklenemedi: ' + error }, { status: 500 });
    }
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error }, { status: 500 });
  }
}
