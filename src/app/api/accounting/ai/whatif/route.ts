import { NextRequest, NextResponse } from 'next/server';

// Mock what-if scenario calculator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      scenarioType, 
      inputs, 
      periodId,
      currentVat = 0,
      currentCash = 0,
      currentProfit = 0
    } = body;

    let results: any = {};

    switch (scenarioType) {
      case 'early_payment_discount':
        const discountRate = inputs.discountRate || 0.02; // 2% default
        const invoiceAmount = inputs.invoiceAmount || 10000;
        const discountAmount = invoiceAmount * discountRate;
        const taxSavings = discountAmount * 0.18; // 18% KDV
        
        results = {
          vatImpact: -taxSavings,
          cashImpact: -discountAmount,
          profitImpact: discountAmount - taxSavings,
          formula: `İndirim Tutarı × (1 - Vergi Oranı) - Finansman Maliyeti`,
          calculation: {
            discountAmount,
            taxSavings,
            netBenefit: discountAmount - taxSavings,
            roi: ((discountAmount - taxSavings) / discountAmount) * 100
          },
          confidence: 0.85
        };
        break;

      case 'inventory_valuation':
        const inventoryValue = inputs.inventoryValue || 50000;
        const fifoValue = inputs.fifoValue || 48000;
        const avgValue = inputs.avgValue || 52000;
        const valuationDifference = fifoValue - avgValue;
        const taxImpact = valuationDifference * 0.18;
        
        results = {
          vatImpact: 0,
          cashImpact: 0,
          profitImpact: valuationDifference,
          formula: `COGS Farkı = (FIFO COGS - WAvg COGS) × Stok Miktarı`,
          calculation: {
            fifoValue,
            avgValue,
            difference: valuationDifference,
            taxImpact,
            netImpact: valuationDifference - taxImpact
          },
          confidence: 0.78
        };
        break;

      case 'depreciation_method':
        const assetValue = inputs.assetValue || 100000;
        const usefulLife = inputs.usefulLife || 5;
        const slDepreciation = assetValue / usefulLife;
        const ddbDepreciation = assetValue * (2 / usefulLife);
        const depreciationDifference = slDepreciation - ddbDepreciation;
        const taxBenefit = depreciationDifference * 0.18;
        
        results = {
          vatImpact: 0,
          cashImpact: 0,
          profitImpact: depreciationDifference,
          formula: `Amortisman Farkı = (SL Amortisman - DDB Amortisman) × Vergi Oranı`,
          calculation: {
            slDepreciation,
            ddbDepreciation,
            difference: depreciationDifference,
            taxBenefit,
            netBenefit: depreciationDifference + taxBenefit
          },
          confidence: 0.92
        };
        break;

      case 'expense_capitalization':
        const expenseAmount = inputs.expenseAmount || 20000;
        const capitalizationThreshold = inputs.threshold || 5000;
        const shouldCapitalize = expenseAmount >= capitalizationThreshold;
        const immediateExpense = shouldCapitalize ? 0 : expenseAmount;
        const capitalizedAmount = shouldCapitalize ? expenseAmount : 0;
        const annualDepreciation = capitalizedAmount / 5; // 5 years
        const firstYearImpact = immediateExpense - annualDepreciation;
        
        results = {
          vatImpact: 0,
          cashImpact: 0,
          profitImpact: firstYearImpact,
          formula: `İlk Yıl Etkisi = Gider Yazma - Yıllık Amortisman`,
          calculation: {
            expenseAmount,
            shouldCapitalize,
            immediateExpense,
            capitalizedAmount,
            annualDepreciation,
            firstYearImpact,
            longTermImpact: capitalizedAmount - (annualDepreciation * 5)
          },
          confidence: 0.88
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown scenario type' },
          { status: 400 }
        );
    }

    // Calculate final impacts
    const finalVat = currentVat + (results.vatImpact || 0);
    const finalCash = currentCash + (results.cashImpact || 0);
    const finalProfit = currentProfit + (results.profitImpact || 0);

    const response = {
      success: true,
      data: {
        scenarioType,
        inputs,
        results: {
          ...results,
          finalVat,
          finalCash,
          finalProfit,
          summary: {
            vatChange: results.vatImpact || 0,
            cashChange: results.cashImpact || 0,
            profitChange: results.profitImpact || 0,
            netImpact: (results.vatImpact || 0) + (results.cashImpact || 0) + (results.profitImpact || 0)
          }
        }
      },
      message: 'What-if scenario calculated successfully'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('What-if calculation error:', error);
    return NextResponse.json(
      { error: 'What-if calculation failed' },
      { status: 500 }
    );
  }
}
