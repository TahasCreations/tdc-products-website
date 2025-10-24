import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Get page version history
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    // Bu basit bir implementasyon - gerçek uygulamada ayrı bir versions tablosu olmalı
    // Şimdilik sadece mevcut sayfanın versiyonunu döndürüyoruz
    const page = await prisma.builderPage.findUnique({
      where: { id: params.pageId }
    });

    if (!page) {
      return NextResponse.json({ success: true, versions: [] });
    }

    // Tek versiyon olarak mevcut sayfayı döndür
    const version = {
      id: `${page.id}_v${page.version}`,
      pageId: page.id,
      version: page.version || 1,
      components: page.components,
      rootComponentIds: page.rootComponentIds,
      createdAt: page.updatedAt,
      note: 'Current version',
    };

    return NextResponse.json({ success: true, versions: [version] });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch versions', versions: [] },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

