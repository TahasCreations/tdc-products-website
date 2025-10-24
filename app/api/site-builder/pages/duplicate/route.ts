import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId } = body;

    const originalPage = await prisma.builderPage.findUnique({
      where: { id: pageId }
    });

    if (!originalPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    const duplicatedPage = await prisma.builderPage.create({
      data: {
        name: `${originalPage.name} (Kopya)`,
        slug: `${originalPage.slug}-copy-${Date.now()}`,
        title: originalPage.title,
        description: originalPage.description,
        components: originalPage.components,
        rootComponentIds: originalPage.rootComponentIds,
        seo: originalPage.seo,
        settings: originalPage.settings,
        status: 'draft',
        version: 1,
      }
    });

    return NextResponse.json({ success: true, page: duplicatedPage });
  } catch (error) {
    console.error('Error duplicating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to duplicate page' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

