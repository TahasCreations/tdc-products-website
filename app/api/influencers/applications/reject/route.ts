import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID gerekli' },
        { status: 400 }
      );
    }

    // Başvuruyu reddet
    const application = await prisma.influencerApplication.update({
      where: { id: applicationId },
      data: { 
        status: 'rejected',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Başvuru reddedildi',
      application
    });
  } catch (error) {
    console.error('Influencer başvurusu reddetme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Başvuru reddedilemedi' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

