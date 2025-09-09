import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Para birimini sil
    const { error } = await supabase!
      .from('currencies')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Para birimi silindi' });

  } catch (error) {
    console.error('Currency DELETE error:', error);
    return NextResponse.json(
      { error: 'Para birimi silinemedi' },
      { status: 500 }
    );
  }
}
