import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  generateLicenseKey, 
  generateSecureDownloadUrl,
  LICENSE_TYPES 
} from '@/lib/digital-products/license-manager';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Create digital license after purchase
 * Called automatically when order contains digital products
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, userId, productId, licenseType = 'personal' } = body;

    if (!orderId || !userId || !productId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        productType: true,
        fileUrl: true,
        fileSize: true,
        fileFormat: true,
        downloadLimit: true,
        licenseType: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.productType !== 'DIGITAL') {
      return NextResponse.json(
        { success: false, error: 'Not a digital product' },
        { status: 400 }
      );
    }

    // Get license config
    const licenseConfig = LICENSE_TYPES[licenseType as keyof typeof LICENSE_TYPES] || LICENSE_TYPES.personal;

    // Generate license key
    const licenseKey = generateLicenseKey(productId, userId);

    // Calculate expiry
    const expiresAt = licenseConfig.expiryDays === -1 
      ? null 
      : new Date(Date.now() + licenseConfig.expiryDays * 24 * 60 * 60 * 1000);

    // Generate download URL
    const downloadUrl = generateSecureDownloadUrl(
      product.fileUrl || '',
      licenseKey,
      72 // 3 gün geçerli link
    );

    // Create license
    const license = await prisma.digitalLicense.create({
      data: {
        productId,
        orderId,
        userId,
        licenseKey,
        downloadUrl,
        downloadCount: 0,
        maxDownloads: product.downloadLimit || licenseConfig.downloadLimit,
        expiresAt,
        isActive: true
      },
      include: {
        product: {
          select: {
            title: true,
            fileFormat: true,
            fileSize: true
          }
        }
      }
    });

    // Send email with download link (TODO)
    // await sendDigitalProductEmail(userId, license);

    return NextResponse.json({
      success: true,
      license: {
        id: license.id,
        licenseKey: license.licenseKey,
        downloadUrl: license.downloadUrl,
        maxDownloads: license.maxDownloads,
        expiresAt: license.expiresAt,
        product: license.product
      }
    });

  } catch (error) {
    console.error('License creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create license' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

