/**
 * Test script for Settlement System
 * Run with: node test-settlement-system.js
 */

import { 
  calculateSettlement,
  calculateSettlementForOrders,
  calculateSellerSettlementSummary,
  calculateSettlementRunSummary,
  validateSettlementRunInput,
  calculateMinimumPayoutAmount,
  isPayoutAmountValid,
  calculatePayoutFees,
  generateSettlementDescription,
  generatePayoutDescription,
  SellerType
} from '@tdc/domain';

console.log('🧪 Testing Settlement System...\n');

try {
  // Test 1: Single Order Settlement
  console.log('1️⃣ Testing Single Order Settlement');
  const settlementInput = {
    orderAmount: 1000,
    sellerType: SellerType.TYPE_A, // Company seller
    customCommissionRate: undefined,
    taxRate: 0.18
  };

  const settlementResult = calculateSettlement(settlementInput);
  console.log('✅ Settlement Result:');
  console.log(`   Brüt Tutar: ₺${settlementResult.grossAmount.toFixed(2)}`);
  console.log(`   Komisyon: ₺${settlementResult.commissionAmount.toFixed(2)} (${(settlementResult.commissionRate * 100).toFixed(1)}%)`);
  console.log(`   KDV: ₺${settlementResult.taxAmount.toFixed(2)} (${(settlementResult.taxRate * 100).toFixed(1)}%)`);
  console.log(`   Net Tutar: ₺${settlementResult.netAmount.toFixed(2)}`);
  console.log(`   Satıcı Tipi: ${settlementResult.sellerType}`);
  console.log('');

  // Test 2: Individual Seller Settlement
  console.log('2️⃣ Testing Individual Seller Settlement');
  const individualSettlement = calculateSettlement({
    orderAmount: 1000,
    sellerType: SellerType.TYPE_B, // Individual seller
    taxRate: 0.18
  });

  console.log('✅ Individual Seller Settlement:');
  console.log(`   Brüt Tutar: ₺${individualSettlement.grossAmount.toFixed(2)}`);
  console.log(`   Komisyon: ₺${individualSettlement.commissionAmount.toFixed(2)} (${(individualSettlement.commissionRate * 100).toFixed(1)}%)`);
  console.log(`   KDV: ₺${individualSettlement.taxAmount.toFixed(2)} (${(individualSettlement.taxRate * 100).toFixed(1)}%)`);
  console.log(`   Net Tutar: ₺${individualSettlement.netAmount.toFixed(2)}`);
  console.log('');

  // Test 3: Multiple Orders Settlement
  console.log('3️⃣ Testing Multiple Orders Settlement');
  const orders = [
    {
      orderId: 'order-1',
      sellerId: 'seller-1',
      amount: 1000,
      sellerType: SellerType.TYPE_A
    },
    {
      orderId: 'order-2',
      sellerId: 'seller-1',
      amount: 2000,
      sellerType: SellerType.TYPE_A
    },
    {
      orderId: 'order-3',
      sellerId: 'seller-2',
      amount: 1500,
      sellerType: SellerType.TYPE_B
    }
  ];

  const multipleSettlements = calculateSettlementForOrders(orders, 0.18);
  console.log('✅ Multiple Orders Settlement:');
  multipleSettlements.forEach((settlement, index) => {
    console.log(`   Sipariş ${index + 1} (${settlement.orderId}):`);
    console.log(`     Brüt: ₺${settlement.settlement.grossAmount.toFixed(2)}`);
    console.log(`     Net: ₺${settlement.settlement.netAmount.toFixed(2)}`);
    console.log(`     Komisyon: ${(settlement.settlement.commissionRate * 100).toFixed(1)}%`);
  });
  console.log('');

  // Test 4: Seller Settlement Summary
  console.log('4️⃣ Testing Seller Settlement Summary');
  const sellerOrders = [
    { orderId: 'order-1', amount: 1000, sellerType: SellerType.TYPE_A },
    { orderId: 'order-2', amount: 2000, sellerType: SellerType.TYPE_A },
    { orderId: 'order-3', amount: 1500, sellerType: SellerType.TYPE_A }
  ];

  const sellerSummary = calculateSellerSettlementSummary(sellerOrders, 0.18);
  console.log('✅ Seller Settlement Summary:');
  console.log(`   Toplam Sipariş: ${sellerSummary.totalOrders}`);
  console.log(`   Toplam Brüt: ₺${sellerSummary.totalGrossAmount.toFixed(2)}`);
  console.log(`   Toplam Komisyon: ₺${sellerSummary.totalCommissionAmount.toFixed(2)}`);
  console.log(`   Toplam KDV: ₺${sellerSummary.totalTaxAmount.toFixed(2)}`);
  console.log(`   Toplam Net: ₺${sellerSummary.totalNetAmount.toFixed(2)}`);
  console.log(`   Ortalama Komisyon Oranı: ${(sellerSummary.averageCommissionRate * 100).toFixed(2)}%`);
  console.log('');

  // Test 5: Settlement Run Summary
  console.log('5️⃣ Testing Settlement Run Summary');
  const sellerSettlements = [
    {
      sellerId: 'seller-1',
      totalOrders: 3,
      totalGrossAmount: 4500,
      totalCommissionAmount: 315,
      totalTaxAmount: 56.7,
      totalNetAmount: 4128.3
    },
    {
      sellerId: 'seller-2',
      totalOrders: 2,
      totalGrossAmount: 3000,
      totalCommissionAmount: 300,
      totalTaxAmount: 54,
      totalNetAmount: 2646
    }
  ];

  const runSummary = calculateSettlementRunSummary(sellerSettlements);
  console.log('✅ Settlement Run Summary:');
  console.log(`   Toplam Satıcı: ${runSummary.totalSellers}`);
  console.log(`   Toplam Sipariş: ${runSummary.totalOrders}`);
  console.log(`   Toplam Brüt: ₺${runSummary.totalGrossAmount.toFixed(2)}`);
  console.log(`   Toplam Komisyon: ₺${runSummary.totalCommission.toFixed(2)}`);
  console.log(`   Toplam KDV: ₺${runSummary.totalTax.toFixed(2)}`);
  console.log(`   Toplam Net: ₺${runSummary.totalNetAmount.toFixed(2)}`);
  console.log(`   Ortalama Komisyon Oranı: ${(runSummary.averageCommissionRate * 100).toFixed(2)}%`);
  console.log('');

  // Test 6: Settlement Run Validation
  console.log('6️⃣ Testing Settlement Run Validation');
  const validInput = {
    tenantId: 'tenant-1',
    runType: 'MANUAL',
    periodStart: new Date('2024-01-01'),
    periodEnd: new Date('2024-01-31'),
    description: 'January 2024 settlement'
  };

  const invalidInput = {
    tenantId: '',
    runType: 'INVALID',
    periodStart: new Date('2024-01-31'),
    periodEnd: new Date('2024-01-01'),
    description: 'Invalid input'
  };

  const validResult = validateSettlementRunInput(validInput);
  const invalidResult = validateSettlementRunInput(invalidInput);

  console.log('✅ Settlement Run Validation:');
  console.log(`   Valid Input: ${validResult.isValid ? '✅ Valid' : '❌ Invalid'}`);
  if (!validResult.isValid) {
    console.log(`     Errors: ${validResult.errors.join(', ')}`);
  }

  console.log(`   Invalid Input: ${invalidResult.isValid ? '✅ Valid' : '❌ Invalid'}`);
  if (!invalidResult.isValid) {
    console.log(`     Errors: ${invalidResult.errors.join(', ')}`);
  }
  console.log('');

  // Test 7: Payout Calculations
  console.log('7️⃣ Testing Payout Calculations');
  const payoutAmount = 1000;
  
  const bankTransferFees = calculatePayoutFees(payoutAmount, 'BANK_TRANSFER');
  const paypalFees = calculatePayoutFees(payoutAmount, 'PAYPAL');
  const stripeFees = calculatePayoutFees(payoutAmount, 'STRIPE');

  console.log('✅ Payout Fee Calculations:');
  console.log(`   Bank Transfer (₺${payoutAmount}):`);
  console.log(`     Fee: ₺${bankTransferFees.feeAmount.toFixed(2)} (${(bankTransferFees.feeRate * 100).toFixed(2)}%)`);
  console.log(`     Net: ₺${bankTransferFees.netAmount.toFixed(2)}`);
  
  console.log(`   PayPal (₺${payoutAmount}):`);
  console.log(`     Fee: ₺${paypalFees.feeAmount.toFixed(2)} (${(paypalFees.feeRate * 100).toFixed(2)}%)`);
  console.log(`     Net: ₺${paypalFees.netAmount.toFixed(2)}`);
  
  console.log(`   Stripe (₺${payoutAmount}):`);
  console.log(`     Fee: ₺${stripeFees.feeAmount.toFixed(2)} (${(stripeFees.feeRate * 100).toFixed(2)}%)`);
  console.log(`     Net: ₺${stripeFees.netAmount.toFixed(2)}`);
  console.log('');

  // Test 8: Minimum Payout Amounts
  console.log('8️⃣ Testing Minimum Payout Amounts');
  const companyMin = calculateMinimumPayoutAmount(SellerType.TYPE_A);
  const individualMin = calculateMinimumPayoutAmount(SellerType.TYPE_B);

  console.log('✅ Minimum Payout Amounts:');
  console.log(`   Company Seller (TYPE_A): ₺${companyMin}`);
  console.log(`   Individual Seller (TYPE_B): ₺${individualMin}`);

  // Test payout validation
  const companyValidation = isPayoutAmountValid(50, SellerType.TYPE_A);
  const individualValidation = isPayoutAmountValid(50, SellerType.TYPE_B);

  console.log(`   ₺50 for Company Seller: ${companyValidation.isValid ? '✅ Valid' : '❌ Invalid'} (Min: ₺${companyValidation.minimumRequired})`);
  console.log(`   ₺50 for Individual Seller: ${individualValidation.isValid ? '✅ Valid' : '❌ Invalid'} (Min: ₺${individualValidation.minimumRequired})`);
  console.log('');

  // Test 9: Description Generation
  console.log('9️⃣ Testing Description Generation');
  const settlementDesc = generateSettlementDescription(
    SellerType.TYPE_A,
    5,
    10000,
    8500,
    0.07
  );

  const payoutDesc = generatePayoutDescription(
    'Samsung Store',
    8500,
    5,
    new Date('2024-01-01'),
    new Date('2024-01-31')
  );

  console.log('✅ Description Generation:');
  console.log(`   Settlement Description: ${settlementDesc}`);
  console.log(`   Payout Description: ${payoutDesc}`);
  console.log('');

  // Test 10: Commission Rate Comparison
  console.log('10️⃣ Testing Commission Rate Comparison');
  const companySettlement = calculateSettlement({
    orderAmount: 1000,
    sellerType: SellerType.TYPE_A
  });

  const individualSettlement2 = calculateSettlement({
    orderAmount: 1000,
    sellerType: SellerType.TYPE_B
  });

  console.log('✅ Commission Rate Comparison (₺1000 order):');
  console.log(`   Company Seller (TYPE_A):`);
  console.log(`     Commission: ${(companySettlement.commissionRate * 100).toFixed(1)}%`);
  console.log(`     Net Amount: ₺${companySettlement.netAmount.toFixed(2)}`);
  console.log(`   Individual Seller (TYPE_B):`);
  console.log(`     Commission: ${(individualSettlement2.commissionRate * 100).toFixed(1)}%`);
  console.log(`     Net Amount: ₺${individualSettlement2.netAmount.toFixed(2)}`);
  console.log(`   Difference: ₺${(companySettlement.netAmount - individualSettlement2.netAmount).toFixed(2)}`);
  console.log('');

  console.log('🎉 All Settlement system tests completed successfully!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Stack trace:', error.stack);
}

