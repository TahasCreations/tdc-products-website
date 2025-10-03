export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getVision } from '@/lib/gcp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, gcsUri } = body;

    if (!imageUrl && !gcsUri) {
      return NextResponse.json(
        { error: 'Either imageUrl or gcsUri is required' },
        { status: 400 }
      );
    }

    const vision = getVision();
    const image = imageUrl ? { source: { imageUri: imageUrl } } : { source: { imageUri: gcsUri } };

    // Run SafeSearch detection
    const [result] = await vision.safeSearchDetection(image);
    const safeSearch = result.safeSearchAnnotation;

    if (!safeSearch) {
      return NextResponse.json(
        { error: 'SafeSearch detection failed' },
        { status: 500 }
      );
    }

    // Extract categories
    const categories = {
      adult: safeSearch.adult || 'UNKNOWN',
      spoof: safeSearch.spoof || 'UNKNOWN',
      medical: safeSearch.medical || 'UNKNOWN',
      violence: safeSearch.violence || 'UNKNOWN',
      racy: safeSearch.racy || 'UNKNOWN',
    };

    // Apply moderation policy
    const reject = 
      categories.adult === 'LIKELY' || categories.adult === 'VERY_LIKELY' ||
      categories.violence === 'LIKELY' || categories.violence === 'VERY_LIKELY' ||
      categories.medical === 'LIKELY' || categories.medical === 'VERY_LIKELY' ||
      categories.racy === 'LIKELY' || categories.racy === 'VERY_LIKELY';

    return NextResponse.json({
      ok: true,
      reject,
      categories,
      message: reject ? 'Image rejected due to content policy' : 'Image approved',
    });
  } catch (error) {
    console.error('Image moderation failed:', error);
    return NextResponse.json(
      { 
        error: 'Moderation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
