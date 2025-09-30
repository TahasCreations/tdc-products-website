import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag, secret } = await request.json();

    // Verify the secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: 'Tag is required' }, { status: 400 });
    }

    // Revalidate the specific tag
    revalidateTag(tag);

    return NextResponse.json({ 
      message: `Revalidated tag: ${tag}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' }, 
      { status: 500 }
    );
  }
}

