import { NextRequest, NextResponse } from 'next/server';

// Mock AI suggestions generator
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodId = searchParams.get('periodId');
    const type = searchParams.get('type');

    // Mock suggestions based on period data
    const mockSuggestions = [
      {
        id: 'suggestion-1',
        type: 'VAT_OPTIMIZATION',
        title: 'Erken Ödeme İndirimi',
        description: 'Tedarikçi faturalarında %2 erken ödeme indirimi uygulayarak KDV tasarrufu sağlayabilirsiniz.',
        confidence: 0.85,
        impact: {
          vat: -2000,
          cash: -50000,
          profit: 3000
        },
        formula: 'İndirim Tutarı × (1 - Vergi Oranı) - Finansman Maliyeti',
        conditions: {
          minInvoiceAmount: 10000,
          paymentDays: 10,
          discountRate: 0.02
        },
        status: 'PENDING',
        createdAt: new Date().toISOString()
      },
      {
        id: 'suggestion-2',
        type: 'PROFIT_OPTIMIZATION',
        title: 'Stok Değerleme Yöntemi Değişikliği',
        description: 'FIFO yerine Weighted Average kullanarak COGS optimizasyonu yapabilirsiniz.',
        confidence: 0.78,
        impact: {
          vat: 0,
          cash: 0,
          profit: -1200
        },
        formula: 'COGS Farkı = (FIFO COGS - WAvg COGS) × Stok Miktarı',
        conditions: {
          currentMethod: 'FIFO',
          proposedMethod: 'Weighted Average',
          inventoryValue: 50000
        },
        status: 'PENDING',
        createdAt: new Date().toISOString()
      },
      {
        id: 'suggestion-3',
        type: 'CASH_FLOW',
        title: 'Amortisman Yöntemi Optimizasyonu',
        description: 'Straight-line yerine Double Declining Balance kullanarak nakit akışını iyileştirebilirsiniz.',
        confidence: 0.92,
        impact: {
          vat: 0,
          cash: 0,
          profit: 2500
        },
        formula: 'Amortisman Farkı = (SL Amortisman - DDB Amortisman) × Vergi Oranı',
        conditions: {
          currentMethod: 'Straight Line',
          proposedMethod: 'Double Declining Balance',
          assetValue: 100000,
          usefulLife: 5
        },
        status: 'PENDING',
        createdAt: new Date().toISOString()
      },
      {
        id: 'suggestion-4',
        type: 'DEDUCTIBILITY',
        title: 'Gider Kategorileri Optimizasyonu',
        description: 'Bazı giderleri farklı kategorilere taşıyarak indirilebilirlik oranını artırabilirsiniz.',
        confidence: 0.88,
        impact: {
          vat: -500,
          cash: 0,
          profit: 500
        },
        formula: 'KDV Tasarrufu = Gider Tutarı × (Yeni Oran - Eski Oran) × Vergi Oranı',
        conditions: {
          currentCategory: 'entertainment',
          proposedCategory: 'marketing',
          amount: 10000,
          currentRate: 0,
          proposedRate: 1.0
        },
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    ];

    // Filter by type if specified
    const filteredSuggestions = type ? 
      mockSuggestions.filter(s => s.type === type) : 
      mockSuggestions;

    return NextResponse.json({
      success: true,
      data: {
        suggestions: filteredSuggestions,
        summary: {
          total: filteredSuggestions.length,
          byType: {
            VAT_OPTIMIZATION: mockSuggestions.filter(s => s.type === 'VAT_OPTIMIZATION').length,
            PROFIT_OPTIMIZATION: mockSuggestions.filter(s => s.type === 'PROFIT_OPTIMIZATION').length,
            CASH_FLOW: mockSuggestions.filter(s => s.type === 'CASH_FLOW').length,
            DEDUCTIBILITY: mockSuggestions.filter(s => s.type === 'DEDUCTIBILITY').length
          },
          averageConfidence: mockSuggestions.reduce((sum, s) => sum + s.confidence, 0) / mockSuggestions.length
        }
      },
      message: 'AI suggestions retrieved successfully'
    });

  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve AI suggestions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suggestionId, action, userId } = body;

    // Mock suggestion application
    const mockApplication = {
      suggestionId,
      action, // 'apply', 'reject', 'schedule'
      userId,
      appliedAt: new Date().toISOString(),
      result: {
        success: true,
        message: 'Suggestion applied successfully',
        impact: {
          vat: -2000,
          cash: -50000,
          profit: 3000
        },
        journalEntries: [
          {
            account: '120.01.001', // KDV İndirilecek
            debit: 2000,
            credit: 0,
            description: 'Erken ödeme indirimi KDV tasarrufu'
          },
          {
            account: '320.01.001', // Ticari Mal
            debit: 0,
            credit: 2000,
            description: 'Erken ödeme indirimi KDV tasarrufu'
          }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: mockApplication,
      message: 'Suggestion processed successfully'
    });

  } catch (error) {
    console.error('Suggestion application error:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
}
