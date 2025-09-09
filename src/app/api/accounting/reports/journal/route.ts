import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';

    // Yevmiye defteri için tüm fiş satırlarını getir
    const { data: journalData, error: journalError } = await supabase!
      .from('journal_lines')
      .select(`
        id,
        debit,
        credit,
        description,
        created_at,
        journal_entries (
          no,
          date,
          description
        ),
        accounts (
          code,
          name
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    if (journalError) {
      throw journalError;
    }

    const formattedData = journalData?.map((line: any) => ({
      id: line.id,
      date: line.journal_entries?.date || line.created_at,
      journal_no: line.journal_entries?.no || '',
      description: line.description || line.journal_entries?.description || '',
      account_code: line.accounts?.code || '',
      account_name: line.accounts?.name || '',
      debit: line.debit || 0,
      credit: line.credit || 0
    })) || [];

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Journal error:', error);
    return NextResponse.json(
      { error: 'Yevmiye defteri oluşturulamadı' },
      { status: 500 }
    );
  }
}
