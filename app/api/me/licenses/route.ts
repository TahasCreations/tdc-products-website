import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get user's digital licenses
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const licenses = await prisma.digitalLicense.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          select: {
            title: true,
            images: true,
            fileFormat: true,
            fileSize: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse images
    const formattedLicenses = licenses.map(license => ({
      ...license,
      product: {
        ...license.product,
        images: license.product.images ? JSON.parse(license.product.images as string) : []
      }
    }));

    return NextResponse.json({
      success: true,
      licenses: formattedLicenses
    });

  } catch (error) {
    console.error('Error fetching licenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch licenses' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

