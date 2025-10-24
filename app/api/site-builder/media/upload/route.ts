import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'uncategorized';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const uploadedAssets = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);

      const url = `/uploads/${folder}/${filename}`;
      const mimeType = file.type;
      const type = mimeType.startsWith('image/') ? 'image' : 
                   mimeType.startsWith('video/') ? 'video' : 'other';

      // Save to database
      const asset = await prisma.mediaAsset.create({
        data: {
          name: file.name,
          url,
          thumbnailUrl: type === 'image' ? url : null,
          type,
          mimeType,
          size: file.size,
          folder,
          tags: JSON.stringify([]),
        }
      });

      uploadedAssets.push({
        ...asset,
        tags: [],
      });
    }

    return NextResponse.json({ success: true, assets: uploadedAssets });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

