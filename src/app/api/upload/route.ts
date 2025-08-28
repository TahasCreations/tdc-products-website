import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Boyut sınırı kaldırıldı

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece JPEG, PNG ve WebP dosyaları kabul edilir' }, { status: 400 });
    }

    // Dosyayı Vercel Blob'a yükle
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      success: true
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
  }
}
