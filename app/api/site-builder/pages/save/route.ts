import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page } = body;

    if (!page || !page.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid page data' },
        { status: 400 }
      );
    }

    // Check if page exists
    const existing = await prisma.builderPage.findUnique({
      where: { id: page.id }
    });

    let savedPage;

    if (existing) {
      // Update existing page
      savedPage = await prisma.builderPage.update({
        where: { id: page.id },
        data: {
          name: page.name,
          slug: page.slug,
          title: page.title,
          description: page.description,
          components: JSON.stringify(page.components),
          rootComponentIds: JSON.stringify(page.rootComponentIds),
          seo: page.seo ? JSON.stringify(page.seo) : null,
          settings: page.settings ? JSON.stringify(page.settings) : null,
          version: (existing.version || 0) + 1,
          updatedAt: new Date(),
        }
      });
    } else {
      // Create new page
      savedPage = await prisma.builderPage.create({
        data: {
          id: page.id,
          name: page.name,
          slug: page.slug,
          title: page.title,
          description: page.description,
          components: JSON.stringify(page.components),
          rootComponentIds: JSON.stringify(page.rootComponentIds),
          seo: page.seo ? JSON.stringify(page.seo) : null,
          settings: page.settings ? JSON.stringify(page.settings) : null,
          status: page.status || 'draft',
          version: 1,
        }
      });
    }

    return NextResponse.json({ success: true, page: savedPage });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save page' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

