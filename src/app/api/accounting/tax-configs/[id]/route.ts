import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Vergi ayarını sil
    const { error } = await supabase!
      .from('tax_configs')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Vergi ayarı silindi' });

  } catch (error) {
    console.error('Tax config DELETE error:', error);
    return NextResponse.json(
      { error: 'Vergi ayarı silinemedi' },
      { status: 500 }
    );
  }
}
