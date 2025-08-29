import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClients } from '../../../../lib/supabase';
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

    // Dosya boyutu kontrolü (10MB - daha büyük limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 10MB\'dan küçük olmalıdır' }, { status: 400 });
    }

    console.log('Upload başladı:', file.name, file.size, file.type);

    const clients = getServerSupabaseClients();
    
    if (clients.configured && clients.supabaseAdmin) {
      // Supabase Storage kullan
      try {
        console.log('Supabase Storage kullanılıyor...');
        
        // Dosya adını oluştur
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `uploads/${fileName}`;

        // Dosyayı Supabase Storage'a yükle
        const { data, error } = await clients.supabaseAdmin.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Supabase upload error:', error);
          throw new Error(`Supabase upload failed: ${error.message}`);
        }

        console.log('Supabase upload başarılı:', data);

        // Public URL al
        const { data: { publicUrl } } = clients.supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(filePath);

        console.log('Public URL:', publicUrl);

        return NextResponse.json({
          url: publicUrl,
          success: true
        });
      } catch (error) {
        console.error('Supabase upload failed, falling back to local storage:', error);
        // Fallback to local storage
      }
    }

    // Fallback: Local storage (development için)
    console.log('Local storage kullanılıyor...');
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
      
      console.log('Local upload başarılı:', publicUrl);
      
      return NextResponse.json({
        url: publicUrl,
        success: true
      });
    } catch (error) {
      console.error('Local storage upload error:', error);
      return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
  }
}
