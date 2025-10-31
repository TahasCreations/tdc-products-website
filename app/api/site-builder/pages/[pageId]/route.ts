import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// GET: Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const page = await prisma.builderPage.findUnique({
      where: { id: params.pageId }
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedPage = {
      ...page,
      components: typeof page.components === 'string' ? JSON.parse(page.components) : page.components,
      rootComponentIds: typeof page.rootComponentIds === 'string' ? JSON.parse(page.rootComponentIds) : page.rootComponentIds,
      seo: page.seo ? (typeof page.seo === 'string' ? JSON.parse(page.seo) : page.seo) : undefined,
      settings: page.settings ? (typeof page.settings === 'string' ? JSON.parse(page.settings) : page.settings) : undefined,
    };

    return NextResponse.json({ success: true, page: formattedPage });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    );
  } finally {
    }
}

// DELETE: Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    await prisma.builderPage.delete({
      where: { id: params.pageId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

