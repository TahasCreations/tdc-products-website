export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const ALLOWED_HOSTS = [
  'storage.googleapis.com',
  process.env.GCS_EXPORT_BUCKET ? `storage.googleapis.com/${process.env.GCS_EXPORT_BUCKET}` : null,
  process.env.GCS_BUCKET ? `storage.googleapis.com/${process.env.GCS_BUCKET}` : null,
].filter(Boolean);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const src = url.searchParams.get('src');
    const width = url.searchParams.get('w');
    const height = url.searchParams.get('h');
    const quality = url.searchParams.get('q');
    const fit = url.searchParams.get('fit') || 'cover';

    if (!src) {
      return NextResponse.json(
        { error: 'src parameter is required' },
        { status: 400 }
      );
    }

    // Security check: validate host
    const srcUrl = new URL(src);
    const isAllowed = ALLOWED_HOSTS.some(host => 
      srcUrl.hostname === host || srcUrl.hostname.endsWith(host)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Host not allowed' },
        { status: 400 }
      );
    }

    // Fetch source image
    const response = await fetch(src);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch source image' },
        { status: 400 }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const qualityNum = quality ? parseInt(quality, 10) : 80;

    // Transform with sharp
    let sharpInstance = sharp(Buffer.from(imageBuffer));

    if (width || height) {
      const transformOptions: any = {
        fit: fit as 'cover' | 'inside' | 'outside',
      };

      if (width) transformOptions.width = parseInt(width, 10);
      if (height) transformOptions.height = parseInt(height, 10);

      sharpInstance = sharpInstance.resize(transformOptions);
    }

    // Convert to WebP
    const outputBuffer = await sharpInstance
      .webp({ quality: qualityNum })
      .toBuffer();

    // Return transformed image
    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': outputBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Image transform failed:', error);
    return NextResponse.json(
      { 
        error: 'Transform failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
