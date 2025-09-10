import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { format, range } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock analytics export
    const exportData = {
      success: true,
      message: `${format.toUpperCase()} formatında rapor oluşturuldu`,
      format,
      range,
      exportedAt: new Date().toISOString(),
      fileSize: format === 'pdf' ? '2.5 MB' : '1.8 MB',
      recordCount: 1250
    };

    return NextResponse.json(exportData);

  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Rapor dışa aktarılamadı' },
      { status: 500 }
    );
  }
}