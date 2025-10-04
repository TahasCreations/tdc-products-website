import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getFCM } from '@/lib/gcp';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (ADMIN role only)
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Admin access required',
      }, { status: 403 });
    }

    const body = await request.json();
    const { userId, title, body: messageBody, data, token } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return NextResponse.json({
        error: 'Title is required',
      }, { status: 400 });
    }

    if (!messageBody || typeof messageBody !== 'string') {
      return NextResponse.json({
        error: 'Message body is required',
      }, { status: 400 });
    }

    // Either userId or token must be provided
    if (!userId && !token) {
      return NextResponse.json({
        error: 'Either userId or token is required',
      }, { status: 400 });
    }

    console.log(`📤 Sending push notification: "${title}"`);

    const fcm = getFCM();
    const messaging = fcm.messaging();

    let pushTokens: string[] = [];

    if (token) {
      // Send to specific token
      pushTokens = [token];
    } else {
      // Get all push tokens for the user
      const userTokens = await prisma.pushToken.findMany({
        where: {
          userId,
        },
        select: {
          token: true,
        },
      });

      pushTokens = userTokens.map(pt => pt.token);
    }

    if (pushTokens.length === 0) {
      return NextResponse.json({
        error: 'No push tokens found for user',
      }, { status: 404 });
    }

    // Prepare notification payload
    const notification = {
      title,
      body: messageBody,
    };

    const payload: any = {
      notification,
      data: data || {},
    };

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send to each token
    for (const pushToken of pushTokens) {
      try {
        const message = {
          ...payload,
          token: pushToken,
        };

        const response = await messaging.send(message);
        console.log(`✅ Push sent successfully: ${response}`);
        results.successful++;

      } catch (error) {
        console.error(`❌ Failed to send push to token ${pushToken}:`, error);
        results.failed++;
        results.errors.push(`${pushToken}: ${error instanceof Error ? error.message : 'Unknown error'}`);

        // If token is invalid, remove it from database
        if (error instanceof Error && (
          error.message.includes('invalid-registration-token') ||
          error.message.includes('registration-token-not-registered')
        )) {
          console.log(`🧹 Removing invalid token: ${pushToken}`);
          await prisma.pushToken.deleteMany({
            where: { token: pushToken },
          });
        }
      }
    }

    console.log(`📊 Push notification results: ${results.successful} successful, ${results.failed} failed`);

    return NextResponse.json({
      success: results.successful > 0,
      message: `Push notifications sent: ${results.successful} successful, ${results.failed} failed`,
      results: {
        total: pushTokens.length,
        successful: results.successful,
        failed: results.failed,
        errors: results.errors,
      },
    });

  } catch (error) {
    console.error('💥 Push notification error:', error);
    
    return NextResponse.json({
      error: 'Failed to send push notification',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Broadcast to all users (ADMIN only)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication (ADMIN role only)
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Admin access required',
      }, { status: 403 });
    }

    const body = await request.json();
    const { title, body: messageBody, data } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return NextResponse.json({
        error: 'Title is required',
      }, { status: 400 });
    }

    if (!messageBody || typeof messageBody !== 'string') {
      return NextResponse.json({
        error: 'Message body is required',
      }, { status: 400 });
    }

    console.log(`📢 Broadcasting push notification: "${title}"`);

    // Get all active push tokens
    const allTokens = await prisma.pushToken.findMany({
      select: {
        token: true,
        userId: true,
      },
    });

    if (allTokens.length === 0) {
      return NextResponse.json({
        error: 'No push tokens found',
      }, { status: 404 });
    }

    const fcm = getFCM();
    const messaging = fcm.messaging();

    // Prepare notification payload
    const notification = {
      title,
      body: messageBody,
    };

    const payload = {
      notification,
      data: data || {},
    };

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
      invalidTokens: [] as string[],
    };

    // Send to each token
    for (const { token, userId } of allTokens) {
      try {
        const message = {
          ...payload,
          token,
        };

        const response = await messaging.send(message);
        console.log(`✅ Broadcast sent to user ${userId}: ${response}`);
        results.successful++;

      } catch (error) {
        console.error(`❌ Failed to send broadcast to token ${token}:`, error);
        results.failed++;
        results.errors.push(`${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);

        // If token is invalid, mark for removal
        if (error instanceof Error && (
          error.message.includes('invalid-registration-token') ||
          error.message.includes('registration-token-not-registered')
        )) {
          results.invalidTokens.push(token);
        }
      }
    }

    // Remove invalid tokens
    if (results.invalidTokens.length > 0) {
      await prisma.pushToken.deleteMany({
        where: {
          token: { in: results.invalidTokens },
        },
      });
      console.log(`🧹 Removed ${results.invalidTokens.length} invalid tokens`);
    }

    console.log(`📊 Broadcast results: ${results.successful} successful, ${results.failed} failed`);

    return NextResponse.json({
      success: results.successful > 0,
      message: `Broadcast completed: ${results.successful} successful, ${results.failed} failed`,
      results: {
        total: allTokens.length,
        successful: results.successful,
        failed: results.failed,
        invalidTokensRemoved: results.invalidTokens.length,
        errors: results.errors,
      },
    });

  } catch (error) {
    console.error('💥 Push broadcast error:', error);
    
    return NextResponse.json({
      error: 'Failed to broadcast push notification',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// GET endpoint for push notification statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication (ADMIN role only)
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Admin access required',
      }, { status: 403 });
    }

    // Get push notification statistics
    const [totalTokens, totalUsers, recentTokens] = await Promise.all([
      prisma.pushToken.count(),
      prisma.pushToken.groupBy({
        by: ['userId'],
      }).then(groups => groups.length),
      prisma.pushToken.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalTokens,
        totalUsers,
        recentRegistrations: recentTokens,
        avgTokensPerUser: totalUsers > 0 ? (totalTokens / totalUsers).toFixed(2) : '0',
      },
    });

  } catch (error) {
    console.error('Error getting push notification stats:', error);
    
    return NextResponse.json({
      error: 'Failed to get push notification statistics',
    }, { status: 500 });
  }
}
