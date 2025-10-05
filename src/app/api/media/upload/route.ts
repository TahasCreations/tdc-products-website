import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string || '{}');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Dosya türü kontrolü
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm',
      'application/json' // Lottie
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Dosya ID oluştur
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;

    // Upload dizini oluştur
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media');
    await mkdir(uploadDir, { recursive: true });

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Dosya bilgilerini hazırla
    const mediaItem = {
      id: fileId,
      filename: fileName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      width: 0, // Gerçek uygulamada image dimensions çıkarılacak
      height: 0,
      alt: metadata.alt || '',
      caption: metadata.caption || '',
      tags: metadata.tags || [],
      collections: metadata.collections || [],
      variants: {
        original: {
          url: `/uploads/media/${fileName}`,
          width: 0,
          height: 0,
          format: fileExtension as 'jpeg' | 'png' | 'webp' | 'avif',
          quality: 100,
          size: file.size
        }
      },
      blurDataUrl: '', // Gerçek uygulamada blur placeholder oluşturulacak
      colorPalette: null, // Gerçek uygulamada renk paleti çıkarılacak
      metadata: {
        camera: null,
        lens: null,
        settings: null,
        location: null,
        createdAt: new Date().toISOString(),
        uploadedBy: 'system', // Gerçek uygulamada kullanıcı ID'si
        aiGenerated: false
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Gerçek uygulamada veritabanına kaydet
    // await prisma.mediaItem.create({ data: mediaItem });

    return NextResponse.json(mediaItem);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
