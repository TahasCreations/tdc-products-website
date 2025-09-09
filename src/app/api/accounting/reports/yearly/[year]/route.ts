import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  try {
    const supabase = getServerSupabaseClient();
    const year = parseInt(params.year);

    // Yıllık rapor verilerini çek
    const reportData = await generateYearlyReportData(year, supabase);

    // PDF oluştur (basit HTML formatında)
    const htmlContent = generateYearlyReportHTML(reportData, year);

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="yillik-rapor-${year}.html"`
      }
    });

  } catch (error) {
    console.error('Yearly report error:', error);
    return NextResponse.json(
      { error: 'Yıllık rapor oluşturulamadı' },
      { status: 500 }
    );
  }
}

async function generateYearlyReportData(year: number, supabase: any) {
  // Yıllık mali tablolar için veri çek
  const { data: trialBalance } = await supabase
    .from('accounts')
    .select(`
      *,
      journal_lines!inner (
        debit,
        credit
      )
    `)
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`);

  // Gelir tablosu hesapları
  const { data: incomeAccounts } = await supabase
    .from('accounts')
    .select('*')
    .like('code', '6%')
    .eq('is_active', true);

  // Gider hesapları
  const { data: expenseAccounts } = await supabase
    .from('accounts')
    .select('*')
    .like('code', '7%')
    .eq('is_active', true);

  // Varlık hesapları
  const { data: assetAccounts } = await supabase
    .from('accounts')
    .select('*')
    .like('code', '1%')
    .eq('is_active', true);

  // Yükümlülük hesapları
  const { data: liabilityAccounts } = await supabase
    .from('accounts')
    .select('*')
    .like('code', '2%')
    .eq('is_active', true);

  // Özkaynak hesapları
  const { data: equityAccounts } = await supabase
    .from('accounts')
    .select('*')
    .like('code', '3%')
    .eq('is_active', true);

  return {
    trialBalance,
    incomeAccounts,
    expenseAccounts,
    assetAccounts,
    liabilityAccounts,
    equityAccounts,
    year
  };
}

function generateYearlyReportHTML(data: any, year: number) {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yıllık Mali Rapor - ${year}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .text-right { text-align: right; }
        .total { font-weight: bold; background-color: #e9ecef; }
        .footer { margin-top: 50px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>YILLIK MALİ RAPOR</h1>
        <h2>${year} YILI</h2>
        <p>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
    </div>

    <div class="section">
        <h2>BİLANÇO</h2>
        <h3>VARLIKLAR</h3>
        <table>
            <thead>
                <tr>
                    <th>Hesap Kodu</th>
                    <th>Hesap Adı</th>
                    <th class="text-right">Tutar (TL)</th>
                </tr>
            </thead>
            <tbody>
                ${data.assetAccounts?.map((account: any) => `
                    <tr>
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td class="text-right">0,00</td>
                    </tr>
                `).join('') || '<tr><td colspan="3">Veri bulunamadı</td></tr>'}
            </tbody>
        </table>

        <h3>YÜKÜMLÜLÜKLER</h3>
        <table>
            <thead>
                <tr>
                    <th>Hesap Kodu</th>
                    <th>Hesap Adı</th>
                    <th class="text-right">Tutar (TL)</th>
                </tr>
            </thead>
            <tbody>
                ${data.liabilityAccounts?.map((account: any) => `
                    <tr>
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td class="text-right">0,00</td>
                    </tr>
                `).join('') || '<tr><td colspan="3">Veri bulunamadı</td></tr>'}
            </tbody>
        </table>

        <h3>ÖZKAYNAKLAR</h3>
        <table>
            <thead>
                <tr>
                    <th>Hesap Kodu</th>
                    <th>Hesap Adı</th>
                    <th class="text-right">Tutar (TL)</th>
                </tr>
            </thead>
            <tbody>
                ${data.equityAccounts?.map((account: any) => `
                    <tr>
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td class="text-right">0,00</td>
                    </tr>
                `).join('') || '<tr><td colspan="3">Veri bulunamadı</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>GELİR TABLOSU</h2>
        <h3>GELİRLER</h3>
        <table>
            <thead>
                <tr>
                    <th>Hesap Kodu</th>
                    <th>Hesap Adı</th>
                    <th class="text-right">Tutar (TL)</th>
                </tr>
            </thead>
            <tbody>
                ${data.incomeAccounts?.map((account: any) => `
                    <tr>
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td class="text-right">0,00</td>
                    </tr>
                `).join('') || '<tr><td colspan="3">Veri bulunamadı</td></tr>'}
            </tbody>
        </table>

        <h3>GİDERLER</h3>
        <table>
            <thead>
                <tr>
                    <th>Hesap Kodu</th>
                    <th>Hesap Adı</th>
                    <th class="text-right">Tutar (TL)</th>
                </tr>
            </thead>
            <tbody>
                ${data.expenseAccounts?.map((account: any) => `
                    <tr>
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td class="text-right">0,00</td>
                    </tr>
                `).join('') || '<tr><td colspan="3">Veri bulunamadı</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Bu rapor muhasebe sisteminden otomatik olarak oluşturulmuştur.</p>
        <p>Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
    </div>
</body>
</html>
  `;
}
