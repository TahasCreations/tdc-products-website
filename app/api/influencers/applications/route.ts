import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(request: NextRequest) {
  try {
    // Tüm influencer başvurularını getir
    const applications = await prisma.influencerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response
    const formattedApplications = applications.map(app => ({
      id: app.id,
      status: app.status,
      createdAt: app.createdAt,
      user: app.user,
      socialLinks: app.socialLinks || {},
      followerCounts: app.followerCounts || {},
      niche: app.niche || '',
      bio: app.bio || '',
      averageEngagement: app.averageEngagement || 0,
      collaborationTypes: app.collaborationTypes || []
    }));

    return NextResponse.json({
      success: true,
      applications: formattedApplications
    });
  } catch (error) {
    console.error('Influencer başvuruları getirme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Başvurular getirilemedi' },
      { status: 500 }
    );
  } finally {
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

