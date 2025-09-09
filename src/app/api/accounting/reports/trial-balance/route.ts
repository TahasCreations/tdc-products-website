import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';

    // Mizan raporu için hesap bakiyelerini hesapla
    const { data: accounts, error: accountsError } = await supabase!
      .from('accounts')
      .select('id, code, name, type')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('code');

    if (accountsError) {
      throw accountsError;
    }

    // Her hesap için borç ve alacak toplamlarını hesapla
    const trialBalanceData = await Promise.all(
      accounts?.map(async (account) => {
        // Borç toplamı
        const { data: debitData } = await supabase!
          .from('journal_lines')
          .select('debit')
          .eq('account_id', account.id)
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        // Alacak toplamı
        const { data: creditData } = await supabase!
          .from('journal_lines')
          .select('credit')
          .eq('account_id', account.id)
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const debitTotal = debitData?.reduce((sum, line) => sum + (line.debit || 0), 0) || 0;
        const creditTotal = creditData?.reduce((sum, line) => sum + (line.credit || 0), 0) || 0;

        // Bakiye hesaplama (hesap tipine göre)
        let debitBalance = 0;
        let creditBalance = 0;

        if (account.type === 'ASSET' || account.type === 'EXPENSE') {
          // Aktif ve gider hesapları: Borç bakiyesi
          debitBalance = Math.max(0, debitTotal - creditTotal);
        } else {
          // Pasif, özkaynak ve gelir hesapları: Alacak bakiyesi
          creditBalance = Math.max(0, creditTotal - debitTotal);
        }

        return {
          id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          debit_balance: debitBalance,
          credit_balance: creditBalance,
          debit_total: debitTotal,
          credit_total: creditTotal
        };
      }) || []
    );

    // Sadece bakiyesi olan hesapları filtrele
    const filteredData = trialBalanceData.filter(account => 
      account.debit_balance > 0 || account.credit_balance > 0
    );

    return NextResponse.json(filteredData);

  } catch (error) {
    console.error('Trial Balance error:', error);
    return NextResponse.json(
      { error: 'Mizan raporu oluşturulamadı' },
      { status: 500 }
    );
  }
}
