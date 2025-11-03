import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { validateSTLFile, generateSTLMetadata } from '@/lib/digital-products/license-manager';

export const dynamic = 'force-dynamic';

/**
 * Upload digital product file (STL, ZIP)
 * Only for sellers
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateSTLFile(file.name);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // File size limit: 500MB
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu 500MB\'dan büyük olamaz' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'digital-products');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${session.user.id}-${timestamp}-${safeName}`;
    const filePath = join(uploadDir, fileName);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate metadata
    const metadata = generateSTLMetadata(file);

    // Public URL
    const fileUrl = `/uploads/digital-products/${fileName}`;

    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        name: file.name,
        size: file.size,
        format: metadata.fileFormat,
        metadata
      }
    });

  } catch (error) {
    console.error('Digital product upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

