import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const recommendation = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock recommendation application
    const result = {
      success: true,
      message: `${recommendation.itemName} için öneri başarıyla uygulandı`,
      recommendation: recommendation,
      appliedAt: new Date().toISOString()
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Apply recommendation error:', error);
    return NextResponse.json(
      { error: 'Öneri uygulanamadı' },
      { status: 500 }
    );
  }
}
