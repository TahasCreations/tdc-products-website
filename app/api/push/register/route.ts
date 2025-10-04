import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    // For testing without authentication
    const testUserId = 'test-user-123';
    const isTestMode = request.headers.get('x-test-mode') === 'true';
    
    if (!session?.user?.id && !isTestMode) {
      return NextResponse.json({
        error: 'Authentication required',
      }, { status: 401 });
    }

    const userId = session?.user?.id || testUserId;

    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({
        error: 'Push token is required',
      }, { status: 400 });
    }

    // Validate token format (basic validation)
    if (token.length < 10) {
      return NextResponse.json({
        error: 'Invalid push token format',
      }, { status: 400 });
    }

    console.log(`📱 Registering push token for user: ${userId}`);

    // For testing without database
    if (isTestMode) {
      return NextResponse.json({
        success: true,
        message: 'Test mode - push token registered successfully',
        tokenId: 'test-token-id',
        userId
      });
    }

    // Upsert push token (update if exists, create if new)
    const pushToken = await prisma.pushToken.upsert({
      where: {
        token,
      },
      update: {
        userId,
        createdAt: new Date(), // Update timestamp
      },
      create: {
        userId,
        token,
      },
    });

    console.log(`✅ Push token registered successfully: ${pushToken.id}`);

    return NextResponse.json({
      success: true,
      message: 'Push token registered successfully',
      tokenId: pushToken.id,
    });

  } catch (error) {
    console.error('💥 Push token registration error:', error);
    
    return NextResponse.json({
      error: 'Failed to register push token',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// DELETE endpoint to unregister push token
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({
        error: 'Push token is required',
      }, { status: 400 });
    }

    console.log(`📱 Unregistering push token for user: ${session.user.id}`);

    // Delete push token
    const deletedToken = await prisma.pushToken.deleteMany({
      where: {
        token,
        userId: session.user.id,
      },
    });

    if (deletedToken.count === 0) {
      return NextResponse.json({
        error: 'Push token not found',
      }, { status: 404 });
    }

    console.log(`✅ Push token unregistered successfully`);

    return NextResponse.json({
      success: true,
      message: 'Push token unregistered successfully',
      deletedCount: deletedToken.count,
    });

  } catch (error) {
    console.error('💥 Push token unregistration error:', error);
    
    return NextResponse.json({
      error: 'Failed to unregister push token',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// GET endpoint to list user's push tokens
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'Authentication required',
      }, { status: 401 });
    }

    console.log(`📱 Getting push tokens for user: ${session.user.id}`);

    // Get user's push tokens (without exposing the actual tokens)
    const pushTokens = await prisma.pushToken.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        createdAt: true,
        // Don't expose the actual token for security
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      tokens: pushTokens,
      count: pushTokens.length,
    });

  } catch (error) {
    console.error('💥 Error getting push tokens:', error);
    
    return NextResponse.json({
      error: 'Failed to get push tokens',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
