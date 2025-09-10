import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { userId } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock 2FA disable
    const result = {
      success: true,
      message: 'İki faktörlü kimlik doğrulama devre dışı bırakıldı',
      userId,
      disabledAt: new Date().toISOString()
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { error: 'İki faktörlü kimlik doğrulama devre dışı bırakılamadı' },
      { status: 500 }
    );
  }
}
