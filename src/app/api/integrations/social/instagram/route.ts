import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Instagram API status check
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN || 'demo-token'}`);

    if (response.ok) {
      return NextResponse.json({
        status: 'active',
        service: 'Instagram',
        message: 'Instagram API is working',
        data: {
          followers: 12500,
          following: 850,
          posts: 245,
          engagementRate: 4.2,
          avgLikes: 520,
          avgComments: 45
        }
      });
    } else {
      return NextResponse.json({
        status: 'inactive',
        service: 'Instagram',
        message: 'Instagram API connection failed',
        error: 'Invalid access token or service unavailable'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'Instagram',
      message: 'Instagram service error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_post':
        // Mock post creation
        return NextResponse.json({
          success: true,
          message: 'Post created successfully',
          postId: `ig_${Date.now()}`,
          data: {
            caption: data.caption,
            imageUrl: data.imageUrl,
            hashtags: data.hashtags || [],
            status: 'published',
            publishedAt: new Date().toISOString()
          }
        });

      case 'get_insights':
        // Mock insights data
        return NextResponse.json({
          success: true,
          data: {
            impressions: 15600,
            reach: 12300,
            profileViews: 890,
            websiteClicks: 45,
            emailContacts: 12,
            phoneCalls: 8,
            topPosts: [
              {
                id: 'post_1',
                likes: 1250,
                comments: 89,
                reach: 5600
              },
              {
                id: 'post_2',
                likes: 980,
                comments: 67,
                reach: 4200
              }
            ]
          }
        });

      case 'get_stories':
        // Mock stories data
        return NextResponse.json({
          success: true,
          data: {
            activeStories: 3,
            totalViews: 8900,
            replies: 45,
            linkClicks: 23,
            stories: [
              {
                id: 'story_1',
                type: 'image',
                views: 3200,
                replies: 15
              },
              {
                id: 'story_2',
                type: 'video',
                views: 2800,
                replies: 12
              }
            ]
          }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Instagram API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
