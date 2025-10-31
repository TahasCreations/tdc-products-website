import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// GET: List all pages
export async function GET(request: NextRequest) {
  try {
    const pages = await prisma.builderPage.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    // Parse JSON content
    const formattedPages = pages.map(page => ({
      ...page,
      components: typeof page.components === 'string' ? JSON.parse(page.components) : page.components,
      rootComponentIds: typeof page.rootComponentIds === 'string' ? JSON.parse(page.rootComponentIds) : page.rootComponentIds,
      seo: page.seo ? (typeof page.seo === 'string' ? JSON.parse(page.seo) : page.seo) : undefined,
      settings: page.settings ? (typeof page.settings === 'string' ? JSON.parse(page.settings) : page.settings) : undefined,
    }));

    return NextResponse.json({ success: true, pages: formattedPages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    );
  } finally {
    }
}

// POST: Create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, template } = body;

    const page = await prisma.builderPage.create({
      data: {
        name: name || 'Untitled Page',
        slug: slug || `page-${Date.now()}`,
        components: JSON.stringify(template?.components || {}),
        rootComponentIds: JSON.stringify(template?.rootComponentIds || []),
        status: 'draft',
      }
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

