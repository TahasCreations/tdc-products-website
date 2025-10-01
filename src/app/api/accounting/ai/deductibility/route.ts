import { NextRequest, NextResponse } from 'next/server';

// Mock deductibility engine - in production, integrate with rule engine
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, taxCode, countryCode = 'TR', amount, supplier } = body;

    // Mock deductibility rules
    const deductibilityRules = {
      'office': { rule: 'FULL', rate: 100, description: 'Ofis malzemeleri tam indirilebilir' },
      'fuel': { rule: 'PARTIAL', rate: 50, description: 'Yakıt %50 indirilebilir' },
      'marketing': { rule: 'FULL', rate: 100, description: 'Pazarlama harcamaları tam indirilebilir' },
      'entertainment': { rule: 'NONE', rate: 0, description: 'Eğlence harcamaları indirilemez' },
      'travel': { rule: 'PARTIAL', rate: 75, description: 'Seyahat harcamaları %75 indirilebilir' },
      'meals': { rule: 'PARTIAL', rate: 30, description: 'Yemek harcamaları %30 indirilebilir' },
      'utilities': { rule: 'FULL', rate: 100, description: 'Fatura giderleri tam indirilebilir' },
      'rent': { rule: 'FULL', rate: 100, description: 'Kira giderleri tam indirilebilir' }
    };

    const rule = deductibilityRules[category] || { rule: 'NONE', rate: 0, description: 'Kategori bulunamadı' };
    
    // Calculate deductibility
    const deductibleAmount = rule.rule === 'FULL' ? amount : 
                           rule.rule === 'PARTIAL' ? amount * (rule.rate / 100) : 0;
    
    const nonDeductibleAmount = amount - deductibleAmount;

    // Check for anomalies
    const anomalies = [];
    
    // Check for unusual amounts
    const categoryLimits = {
      'office': { max: 50000, min: 10 },
      'fuel': { max: 10000, min: 50 },
      'marketing': { max: 100000, min: 100 },
      'entertainment': { max: 5000, min: 50 },
      'travel': { max: 25000, min: 100 },
      'meals': { max: 2000, min: 20 },
      'utilities': { max: 20000, min: 50 },
      'rent': { max: 100000, min: 500 }
    };

    const limits = categoryLimits[category];
    if (limits) {
      if (amount > limits.max) {
        anomalies.push({
          type: 'unusual_amount',
          severity: 'high',
          message: `Tutar normal aralığın üzerinde (${limits.max} TL)`,
          value: amount,
          threshold: limits.max
        });
      }
      if (amount < limits.min) {
        anomalies.push({
          type: 'unusual_amount',
          severity: 'medium',
          message: `Tutar normal aralığın altında (${limits.min} TL)`,
          value: amount,
          threshold: limits.min
        });
      }
    }

    // Check for duplicate invoice numbers (mock)
    const duplicateCheck = Math.random() > 0.8; // 20% chance of duplicate
    if (duplicateCheck) {
      anomalies.push({
        type: 'duplicate',
        severity: 'high',
        message: 'Aynı fatura numarası tespit edildi',
        value: 'INV-2024-001'
      });
    }

    // Check for missing tax information
    if (!taxCode) {
      anomalies.push({
        type: 'missing_tax',
        severity: 'high',
        message: 'Eksik vergi kodu tespit edildi'
      });
    }

    const result = {
      deductibility: {
        rule: rule.rule,
        rate: rule.rate,
        description: rule.description,
        deductibleAmount,
        nonDeductibleAmount,
        confidence: 0.95
      },
      anomalies,
      hasConflicts: anomalies.length > 0,
      recommendation: {
        action: anomalies.length > 0 ? 'review' : 'approve',
        message: anomalies.length > 0 ? 
          'Fatura inceleme gerektiriyor' : 
          'Fatura onaylanabilir'
      }
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Deductibility analysis completed'
    });

  } catch (error) {
    console.error('Deductibility analysis error:', error);
    return NextResponse.json(
      { error: 'Deductibility analysis failed' },
      { status: 500 }
    );
  }
}
