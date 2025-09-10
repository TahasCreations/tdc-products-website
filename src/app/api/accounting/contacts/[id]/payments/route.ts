import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Cari hesabın ödemelerini getir
    const { data: payments, error } = await supabase!
      .from('contact_payments')
      .select('*')
      .eq('contact_id', params.id)
      .order('payment_date', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(payments || []);

  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      { error: 'Ödemeler alınamadı' },
      { status: 500 }
    );
  }
}
