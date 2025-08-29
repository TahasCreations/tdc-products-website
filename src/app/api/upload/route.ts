import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece JPEG, PNG ve WebP dosyaları kabul edilir' }, { status: 400 });
    }

    // Dosya boyutu kontrolü (5MB - Vercel için optimize)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' }, { status: 400 });
    }

    // Local storage (Vercel'de geçici)
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Upload dizinini oluştur
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await fs.writeFile(filePath, buffer);
      
      const publicUrl = `/uploads/${fileName}`;
      
      return NextResponse.json({
        url: publicUrl,
        success: true
      });
    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
  }
}
