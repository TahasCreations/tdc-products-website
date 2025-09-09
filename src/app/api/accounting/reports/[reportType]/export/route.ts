import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { reportType: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'excel';
    const reportType = params.reportType;

    // Rapor verilerini al
    const reportUrl = new URL(`/api/accounting/reports/${reportType}`, request.url);
    searchParams.forEach((value, key) => {
      if (key !== 'format') {
        reportUrl.searchParams.set(key, value);
      }
    });

    const reportResponse = await fetch(reportUrl.toString());
    if (!reportResponse.ok) {
      throw new Error('Rapor verileri alınamadı');
    }

    const reportData = await reportResponse.json();

    if (format === 'excel') {
      return await exportToExcel(reportType, reportData);
    } else if (format === 'pdf') {
      return await exportToPDF(reportType, reportData);
    } else {
      return NextResponse.json(
        { error: 'Desteklenmeyen format' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export başarısız' },
      { status: 500 }
    );
  }
}

async function exportToExcel(reportType: string, data: any) {
  // Excel export için basit CSV formatı
  let csvContent = '';
  
  switch (reportType) {
    case 'trial-balance':
      csvContent = 'Hesap Kodu,Hesap Adı,Borç Bakiyesi,Alacak Bakiyesi\n';
      data.forEach((row: any) => {
        csvContent += `${row.code},${row.name},${row.debit_balance || 0},${row.credit_balance || 0}\n`;
      });
      break;
      
    case 'ledger':
      csvContent = 'Tarih,Fiş No,Açıklama,Borç,Alacak,Bakiye\n';
      data.entries?.forEach((row: any) => {
        csvContent += `${row.date},${row.journal_no},${row.description},${row.debit || 0},${row.credit || 0},${row.balance || 0}\n`;
      });
      break;
      
    case 'journal':
      csvContent = 'Tarih,Fiş No,Açıklama,Hesap Kodu,Hesap Adı,Borç,Alacak\n';
      data.forEach((row: any) => {
        csvContent += `${row.date},${row.journal_no},${row.description},${row.account_code},${row.account_name},${row.debit || 0},${row.credit || 0}\n`;
      });
      break;
      
    case 'account-statement':
      csvContent = 'Tarih,Fiş No,Açıklama,Borç,Alacak,Bakiye\n';
      data.entries?.forEach((row: any) => {
        csvContent += `${row.date},${row.journal_no},${row.description},${row.debit || 0},${row.credit || 0},${row.balance || 0}\n`;
      });
      break;
      
    case 'kdv-summary':
      csvContent = 'KDV Oranı,KDV Tutarı\n';
      Object.entries(data.kdvRates || {}).forEach(([rate, amount]) => {
        csvContent += `%${rate},${amount}\n`;
      });
      csvContent += `Toplam KDV,${data.totalKdv || 0}\n`;
      break;
      
    default:
      throw new Error('Desteklenmeyen rapor türü');
  }

  const buffer = Buffer.from(csvContent, 'utf-8');
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${reportType}-${new Date().toISOString().split('T')[0]}.xlsx"`
    }
  });
}

async function exportToPDF(reportType: string, data: any) {
  // PDF export için basit HTML formatı
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${reportType} Raporu</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { margin-top: 20px; padding: 10px; background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportType.toUpperCase()} RAPORU</h1>
        <p>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
      </div>
  `;

  switch (reportType) {
    case 'trial-balance':
      htmlContent += '<table><tr><th>Hesap Kodu</th><th>Hesap Adı</th><th>Borç Bakiyesi</th><th>Alacak Bakiyesi</th></tr>';
      data.forEach((row: any) => {
        htmlContent += `<tr><td>${row.code}</td><td>${row.name}</td><td>${row.debit_balance || 0}</td><td>${row.credit_balance || 0}</td></tr>`;
      });
      htmlContent += '</table>';
      break;
      
    case 'ledger':
      htmlContent += `<h2>${data.account?.code} - ${data.account?.name}</h2>`;
      htmlContent += '<table><tr><th>Tarih</th><th>Fiş No</th><th>Açıklama</th><th>Borç</th><th>Alacak</th><th>Bakiye</th></tr>';
      data.entries?.forEach((row: any) => {
        htmlContent += `<tr><td>${row.date}</td><td>${row.journal_no}</td><td>${row.description}</td><td>${row.debit || 0}</td><td>${row.credit || 0}</td><td>${row.balance || 0}</td></tr>`;
      });
      htmlContent += '</table>';
      break;
      
    case 'journal':
      htmlContent += '<table><tr><th>Tarih</th><th>Fiş No</th><th>Açıklama</th><th>Hesap Kodu</th><th>Hesap Adı</th><th>Borç</th><th>Alacak</th></tr>';
      data.forEach((row: any) => {
        htmlContent += `<tr><td>${row.date}</td><td>${row.journal_no}</td><td>${row.description}</td><td>${row.account_code}</td><td>${row.account_name}</td><td>${row.debit || 0}</td><td>${row.credit || 0}</td></tr>`;
      });
      htmlContent += '</table>';
      break;
      
    case 'account-statement':
      htmlContent += `<h2>${data.account?.code} - ${data.account?.name}</h2>`;
      htmlContent += '<table><tr><th>Tarih</th><th>Fiş No</th><th>Açıklama</th><th>Borç</th><th>Alacak</th><th>Bakiye</th></tr>';
      data.entries?.forEach((row: any) => {
        htmlContent += `<tr><td>${row.date}</td><td>${row.journal_no}</td><td>${row.description}</td><td>${row.debit || 0}</td><td>${row.credit || 0}</td><td>${row.balance || 0}</td></tr>`;
      });
      htmlContent += '</table>';
      if (data.summary) {
        htmlContent += `<div class="summary">
          <p>Toplam Borç: ${data.summary.totalDebit}</p>
          <p>Toplam Alacak: ${data.summary.totalCredit}</p>
          <p>Son Bakiye: ${data.summary.finalBalance}</p>
        </div>`;
      }
      break;
      
    case 'kdv-summary':
      htmlContent += '<table><tr><th>KDV Oranı</th><th>KDV Tutarı</th></tr>';
      Object.entries(data.kdvRates || {}).forEach(([rate, amount]) => {
        htmlContent += `<tr><td>%${rate}</td><td>${amount}</td></tr>`;
      });
      htmlContent += `<tr><td><strong>Toplam KDV</strong></td><td><strong>${data.totalKdv || 0}</strong></td></tr>`;
      htmlContent += '</table>';
      break;
      
    default:
      throw new Error('Desteklenmeyen rapor türü');
  }

  htmlContent += '</body></html>';

  const buffer = Buffer.from(htmlContent, 'utf-8');
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${reportType}-${new Date().toISOString().split('T')[0]}.pdf"`
    }
  });
}
