import { NextRequest, NextResponse } from 'next/server';
import { scanExistingPages, categorizePage, extractPageMetadata } from '@/lib/site-builder/page-scanner';

export async function GET(request: NextRequest) {
  try {
    const existingPages = await scanExistingPages();
    
    // Enrich with metadata and categorization
    const enrichedPages = existingPages.map(page => ({
      ...page,
      category: categorizePage(page.slug),
      metadata: extractPageMetadata(page.filePath),
    }));

    // Group by category
    const grouped = enrichedPages.reduce((acc, page) => {
      const category = page.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(page);
      return acc;
    }, {} as Record<string, typeof enrichedPages>);

    return NextResponse.json({
      success: true,
      pages: enrichedPages,
      grouped,
      total: existingPages.length,
    });
  } catch (error) {
    console.error('Error scanning pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scan pages' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

