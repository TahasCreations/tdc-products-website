import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth/middleware';

export const POST = requireAuth(async (request: NextRequest, context) => {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // In production, toggle like in database
    // const existingLike = await prisma.blogLike.findUnique({
    //   where: { postId_userId: { postId, userId: context.user!.id } }
    // });

    // if (existingLike) {
    //   await prisma.blogLike.delete({ where: { id: existingLike.id } });
    // } else {
    //   await prisma.blogLike.create({
    //     data: { postId, userId: context.user!.id, storeId: context.user!.storeId }
    //   });
    // }

    // Mock response
    return NextResponse.json({
      success: true,
      message: 'Like toggled successfully',
    });

  } catch (error) {
    console.error('Blog like error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
});
