export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Create campaign
    const campaign = await prisma.influencerCampaign.create({
      data: {
        influencerId: data.influencerId,
        title: data.title,
        description: data.description,
        category: data.category,
        platform: data.platform,
        pricePerPost: data.pricePerPost,
        pricePerStory: data.pricePerStory,
        pricePerReel: data.pricePerReel,
        followersCount: data.followersCount,
        engagementRate: data.engagementRate,
        avgViews: data.avgViews,
        avgLikes: data.avgLikes,
        status: 'active',
      },
    });

    return Response.json({ success: true, campaign });
  } catch (error) {
    console.error('Campaign create error:', error);
    return Response.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'active';
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');

    const where: any = { status };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (platform) {
      where.platform = platform;
    }

    const campaigns = await prisma.influencerCampaign.findMany({
      where,
      include: {
        influencer: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json({ success: true, campaigns });
  } catch (error) {
    console.error('Campaigns fetch error:', error);
    return Response.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}


