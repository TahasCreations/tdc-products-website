import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Dönem kilidini aç
    const { data, error } = await supabase!
      .from('period_locks')
      .update({
        is_locked: false,
        locked_at: null,
        locked_by: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Period unlock error:', error);
    return NextResponse.json(
      { error: 'Dönem açılamadı' },
      { status: 500 }
    );
  }
}
