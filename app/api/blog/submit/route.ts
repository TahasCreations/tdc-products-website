import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth/middleware';
import { Permission } from '@/lib/rbac/permissions';

export const POST = requireAuth(async (request: NextRequest, context) => {
  try {
    const body = await request.json();
    const { title, content, topicId, tags, status } = body;

    // Validate required fields
    if (!title || !content || !topicId) {
      return NextResponse.json(
        { error: 'Title, content, and topic are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Create blog post
    const blogPost = {
      id: `post_${Date.now()}`,
      title,
      slug,
      content,
      topicId,
      tags: tags || [],
      readingTime,
      status,
      authorId: context.user!.id,
      storeId: context.user!.storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'approved' ? new Date().toISOString() : null,
    };

    // In production, save to database
    // await prisma.blogPost.create({ data: blogPost });

    // Log audit event
    console.log('Blog post created:', {
      id: blogPost.id,
      title: blogPost.title,
      status: blogPost.status,
      authorId: context.user!.id,
    });

    return NextResponse.json({
      id: blogPost.id,
      slug: blogPost.slug,
      message: status === 'pending' 
        ? 'Post submitted for review' 
        : 'Post saved as draft',
    });

  } catch (error) {
    console.error('Blog submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit blog post' },
      { status: 500 }
    );
  }
});
