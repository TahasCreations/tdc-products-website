import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const accountId = searchParams.get('accountId');
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';

    if (!accountId) {
      return NextResponse.json(
        { error: 'Hesap ID gerekli' },
        { status: 400 }
      );
    }

    // Hesap ekstresi için hesap hareketlerini getir
    const { data: statementData, error: statementError } = await supabase!
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
        )
      `)
      .eq('account_id', accountId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    if (statementError) {
      throw statementError;
    }

    // Hesap bilgilerini al
    const { data: accountData, error: accountError } = await supabase!
      .from('accounts')
      .select('code, name, type')
      .eq('id', accountId)
      .single();

    if (accountError) {
      throw accountError;
    }

    // Bakiye hesaplama
    let runningBalance = 0;
    const formattedData = statementData?.map((line: any) => {
      const debit = line.debit || 0;
      const credit = line.credit || 0;
      
      // Hesap tipine göre bakiye hesaplama
      if (accountData.type === 'ASSET' || accountData.type === 'EXPENSE') {
        // Aktif ve gider hesapları: Borç bakiyesi
        runningBalance += debit - credit;
      } else {
        // Pasif, özkaynak ve gelir hesapları: Alacak bakiyesi
        runningBalance += credit - debit;
      }

      return {
        id: line.id,
        date: line.journal_entries?.date || line.created_at,
        journal_no: line.journal_entries?.no || '',
        description: line.description || line.journal_entries?.description || '',
        debit: debit,
        credit: credit,
        balance: runningBalance
      };
    }) || [];

    return NextResponse.json({
      account: accountData,
      entries: formattedData,
      summary: {
        totalDebit: formattedData.reduce((sum, entry) => sum + entry.debit, 0),
        totalCredit: formattedData.reduce((sum, entry) => sum + entry.credit, 0),
        finalBalance: runningBalance
      }
    });

  } catch (error) {
    console.error('Account Statement error:', error);
    return NextResponse.json(
      { error: 'Hesap ekstresi oluşturulamadı' },
      { status: 500 }
    );
  }
}
