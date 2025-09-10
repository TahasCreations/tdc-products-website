import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { userId, reason } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock user lock
    const result = {
      success: true,
      message: 'Kullanıcı hesabı başarıyla kilitlendi',
      userId,
      reason,
      lockedAt: new Date().toISOString(),
      lockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('User lock error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı hesabı kilitlenemedi' },
      { status: 500 }
    );
  }
}
