// /app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/guards';
import { uploadFile, validateFileSize, validateFileType, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES } from '@/lib/storage';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Kullanıcı authentication kontrolü
    const user = await requireUser();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' | 'document'
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }
    
    // Dosya boyutu kontrolü (5MB max)
    if (!validateFileSize(file, 5)) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'dan büyük olamaz' }, { status: 400 });
    }
    
    // Dosya tipi kontrolü
    const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
    if (!validateFileType(file, allowedTypes)) {
      return NextResponse.json({ 
        error: `Desteklenmeyen dosya tipi. İzin verilen tipler: ${allowedTypes.join(', ')}` 
      }, { status: 400 });
    }
    
    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Dosya yükleme
    const folder = type === 'image' ? 'images' : 'documents';
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Güvenli dosya adı
    
    const publicUrl = await uploadFile(
      buffer,
      fileName,
      file.type,
      folder
    );
    
    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yükleme başarısız' },
      { status: 500 }
    );
  }
}
