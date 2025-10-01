import { NextRequest, NextResponse } from 'next/server';

// Mock OCR service - in production, integrate with Tesseract or cloud OCR
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Mock OCR processing
    const mockOcrResult = {
      confidence: 0.92,
      text: `
        Fatura No: INV-2024-001
        Tarih: 15.10.2024
        Tedarikçi: Office Supplies Co
        Adres: İstanbul, Türkiye
        
        Açıklama: Ofis Malzemeleri
        Miktar: 1
        Birim Fiyat: 1,000.00 TL
        KDV Oranı: %18
        KDV Tutarı: 180.00 TL
        Toplam: 1,180.00 TL
      `,
      extractedData: {
        invoiceNumber: 'INV-2024-001',
        date: '2024-10-15',
        supplier: 'Office Supplies Co',
        items: [
          {
            description: 'Ofis Malzemeleri',
            quantity: 1,
            unitPrice: 1000.00,
            taxRate: 0.18,
            taxAmount: 180.00,
            total: 1180.00
          }
        ],
        netAmount: 1000.00,
        taxAmount: 180.00,
        grossAmount: 1180.00,
        currency: 'TRY'
      },
      classification: {
        documentType: 'invoice',
        category: 'office',
        confidence: 0.88,
        taxCode: '0018',
        countryCode: 'TR'
      },
      anomalies: []
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      data: mockOcrResult,
      message: 'OCR processing completed successfully'
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: 'OCR processing failed' },
      { status: 500 }
    );
  }
}
