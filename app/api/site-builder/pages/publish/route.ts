import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId } = body;

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: 'Page ID required' },
        { status: 400 }
      );
    }

    const page = await prisma.builderPage.update({
      where: { id: pageId },
      data: {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error publishing page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish page' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

