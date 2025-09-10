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

    // Mock 2FA enable
    const result = {
      success: true,
      message: 'İki faktörlü kimlik doğrulama etkinleştirildi',
      userId,
      enabledAt: new Date().toISOString(),
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      secretKey: 'JBSWY3DPEHPK3PXP'
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { error: 'İki faktörlü kimlik doğrulama etkinleştirilemedi' },
      { status: 500 }
    );
  }
}
