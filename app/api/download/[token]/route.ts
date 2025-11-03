import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyDownloadToken } from '@/lib/digital-products/license-manager';
import { readFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Secure download endpoint for digital products
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    // Verify token
    const verification = verifyDownloadToken(token);
    
    if (!verification.valid) {
      return new NextResponse(
        JSON.stringify({ error: verification.error }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { fileUrl, licenseKey } = verification;
    
    // Get license from database
    const license = await prisma.digitalLicense.findUnique({
      where: { licenseKey },
      include: {
        product: {
          select: {
            title: true,
            fileUrl: true,
            fileFormat: true
          }
        }
      }
    });

    if (!license) {
      return NextResponse.json(
        { error: 'Lisans bulunamadı' },
        { status: 404 }
      );
    }

    if (!license.isActive) {
      return NextResponse.json(
        { error: 'Lisans aktif değil' },
        { status: 403 }
      );
    }

    // Check download limit
    if (license.maxDownloads !== -1 && license.downloadCount >= license.maxDownloads) {
      return NextResponse.json(
        { error: 'Download limiti aşıldı' },
        { status: 403 }
      );
    }

    // Update download count
    await prisma.digitalLicense.update({
      where: { id: license.id },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadAt: new Date()
      }
    });

    // Read file
    const filePath = join(process.cwd(), 'public', fileUrl || license.product.fileUrl || '');
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const contentType = getContentType(license.product.fileFormat || 'zip');
    
    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${license.product.title}.${license.product.fileFormat}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download başarısız' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function getContentType(format: string): string {
  const types: Record<string, string> = {
    'zip': 'application/zip',
    'stl': 'model/stl',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'pdf': 'application/pdf'
  };
  
  return types[format.toLowerCase()] || 'application/octet-stream';
}

