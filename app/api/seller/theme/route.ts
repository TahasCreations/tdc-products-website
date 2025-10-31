import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sellerId, logoUrl, primaryColor, heroImageUrls, headerLayout } = await req.json();

    // Verify seller ownership
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { id: sellerId, userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Check if theme exists
    const existingTheme = await prisma.storeTheme.findUnique({
      where: { sellerId },
    });

    let theme;
    if (existingTheme) {
      // Update existing theme
      theme = await prisma.storeTheme.update({
        where: { sellerId },
        data: {
          logoUrl,
          primaryColor,
          heroImageUrls: JSON.stringify(heroImageUrls || []),
          headerLayout,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new theme
      theme = await prisma.storeTheme.create({
        data: {
          sellerId,
          logoUrl,
          primaryColor,
          heroImageUrls: JSON.stringify(heroImageUrls || []),
          headerLayout,
        },
      });
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error saving theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        theme: true,
      },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    return NextResponse.json(sellerProfile.theme);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

