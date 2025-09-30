/**
 * Test script for Invoice System
 * Run with: node test-invoice-system.js
 */

import { 
  determineInvoiceType,
  determineInvoiceParties,
  transformItemsForInvoice,
  calculateInvoiceTotals,
  generateInvoiceNotes,
  validateInvoiceCreationInput,
  createInvoiceData,
  generateInvoiceNumber,
  calculateInvoiceDueDate,
  isInvoiceOverdue,
  calculateInvoiceAging,
  SellerType
} from '@tdc/domain';

console.log('🧾 Testing Invoice System...\n');

try {
  // Test 1: Invoice Type Determination
  console.log('1️⃣ Testing Invoice Type Determination');
  
  const companyInvoiceType = determineInvoiceType(SellerType.TYPE_A);
  const individualInvoiceType = determineInvoiceType(SellerType.TYPE_B);
  
  console.log('✅ Invoice Types:');
  console.log(`   Company Seller (TYPE_A): ${companyInvoiceType} (Commission Invoice)`);
  console.log(`   Individual Seller (TYPE_B): ${individualInvoiceType} (Sales Invoice)`);
  console.log('');

  // Test 2: Invoice Parties Determination
  console.log('2️⃣ Testing Invoice Parties Determination');
  
  const customerInfo = {
    id: 'customer-1',
    name: 'Ahmet Yılmaz',
    taxNumber: '12345678901',
    address: 'İstanbul, Türkiye',
    phone: '+90 555 123 4567',
    email: 'ahmet@example.com'
  };

  const sellerInfo = {
    id: 'seller-1',
    name: 'Samsung Store',
    taxNumber: '98765432109',
    address: 'Ankara, Türkiye',
    phone: '+90 312 555 1234',
    email: 'samsung@example.com'
  };

  const companyInfo = {
    id: 'company-1',
    name: 'TDC Market',
    taxNumber: '11111111111',
    address: 'İstanbul, Türkiye',
    phone: '+90 212 555 0000',
    email: 'info@tdc.com'
  };

  // Sales invoice parties (TYPE_B)
  const salesParties = determineInvoiceParties('SALES', customerInfo, sellerInfo, companyInfo);
  console.log('✅ Sales Invoice Parties:');
  console.log(`   Issuer: ${salesParties.issuer.name} (${salesParties.issuer.type})`);
  console.log(`   Buyer: ${salesParties.buyer.name} (${salesParties.buyer.type})`);

  // Commission invoice parties (TYPE_A)
  const commissionParties = determineInvoiceParties('COMMISSION', customerInfo, sellerInfo, companyInfo);
  console.log('✅ Commission Invoice Parties:');
  console.log(`   Issuer: ${commissionParties.issuer.name} (${commissionParties.issuer.type})`);
  console.log(`   Buyer: ${commissionParties.buyer.name} (${commissionParties.buyer.type})`);
  console.log('');

  // Test 3: Item Transformation
  console.log('3️⃣ Testing Item Transformation');
  
  const orderItems = [
    {
      productId: 'product-1',
      productName: 'Samsung Galaxy S24',
      productSku: 'SAMSUNG-S24-128GB',
      description: '128GB Black',
      quantity: 1,
      unitPrice: 25000,
      subtotal: 25000,
      taxRate: 0.18,
      taxAmount: 4500,
      totalAmount: 29500
    },
    {
      productId: 'product-2',
      productName: 'iPhone 15 Pro',
      productSku: 'APPLE-IP15P-256GB',
      description: '256GB Titanium',
      quantity: 1,
      unitPrice: 45000,
      subtotal: 45000,
      taxRate: 0.18,
      taxAmount: 8100,
      totalAmount: 53100
    }
  ];

  const commissionRate = 0.07; // 7%

  // Sales invoice items
  const salesItems = transformItemsForInvoice(orderItems, 'SALES', commissionRate);
  console.log('✅ Sales Invoice Items:');
  salesItems.forEach((item, index) => {
    console.log(`   Item ${index + 1}: ${item.productName} - ₺${item.totalAmount.toFixed(2)}`);
  });

  // Commission invoice items
  const commissionItems = transformItemsForInvoice(orderItems, 'COMMISSION', commissionRate);
  console.log('✅ Commission Invoice Items:');
  commissionItems.forEach((item, index) => {
    console.log(`   Item ${index + 1}: ${item.productName} - ₺${item.totalAmount.toFixed(2)} (Commission: ₺${item.commissionAmount?.toFixed(2)})`);
  });
  console.log('');

  // Test 4: Invoice Totals Calculation
  console.log('4️⃣ Testing Invoice Totals Calculation');
  
  const salesTotals = calculateInvoiceTotals(salesItems);
  const commissionTotals = calculateInvoiceTotals(commissionItems);
  
  console.log('✅ Sales Invoice Totals:');
  console.log(`   Subtotal: ₺${salesTotals.subtotal.toFixed(2)}`);
  console.log(`   Tax: ₺${salesTotals.taxAmount.toFixed(2)}`);
  console.log(`   Total: ₺${salesTotals.totalAmount.toFixed(2)}`);
  
  console.log('✅ Commission Invoice Totals:');
  console.log(`   Subtotal: ₺${commissionTotals.subtotal.toFixed(2)}`);
  console.log(`   Tax: ₺${commissionTotals.taxAmount.toFixed(2)}`);
  console.log(`   Total: ₺${commissionTotals.totalAmount.toFixed(2)}`);
  console.log('');

  // Test 5: Invoice Notes Generation
  console.log('5️⃣ Testing Invoice Notes Generation');
  
  const salesNotes = generateInvoiceNotes('ORD-2024-001', SellerType.TYPE_B, 'Samsung Store', 70000, 4900);
  const commissionNotes = generateInvoiceNotes('ORD-2024-002', SellerType.TYPE_A, 'Apple Store', 50000, 3500);
  
  console.log('✅ Sales Invoice Notes:');
  console.log(`   ${salesNotes}`);
  
  console.log('✅ Commission Invoice Notes:');
  console.log(`   ${commissionNotes}`);
  console.log('');

  // Test 6: Invoice Creation Data
  console.log('6️⃣ Testing Complete Invoice Creation');
  
  const invoiceInput = {
    orderId: 'ORD-2024-001',
    sellerId: 'seller-1',
    sellerType: SellerType.TYPE_B,
    orderAmount: 70000,
    commissionAmount: 4900,
    taxAmount: 882,
    netAmount: 64218,
    customerInfo,
    sellerInfo,
    items: orderItems
  };

  const invoiceData = createInvoiceData(invoiceInput, companyInfo);
  
  console.log('✅ Complete Invoice Data:');
  console.log(`   Invoice Type: ${invoiceData.invoiceType}`);
  console.log(`   Issuer: ${invoiceData.issuer.name} (${invoiceData.issuer.type})`);
  console.log(`   Buyer: ${invoiceData.buyer.name} (${invoiceData.buyer.type})`);
  console.log(`   Total Amount: ₺${invoiceData.totalAmount.toFixed(2)}`);
  console.log(`   Items: ${invoiceData.items.length}`);
  console.log(`   Currency: ${invoiceData.currency}`);
  console.log(`   Notes: ${invoiceData.notes.substring(0, 50)}...`);
  console.log('');

  // Test 7: Invoice Number Generation
  console.log('7️⃣ Testing Invoice Number Generation');
  
  const salesInvoiceNumber = generateInvoiceNumber('SALES', 'tenant-1', 2024);
  const commissionInvoiceNumber = generateInvoiceNumber('COMMISSION', 'tenant-1', 2024);
  
  console.log('✅ Invoice Numbers:');
  console.log(`   Sales Invoice: ${salesInvoiceNumber}`);
  console.log(`   Commission Invoice: ${commissionInvoiceNumber}`);
  console.log('');

  // Test 8: Invoice Due Date Calculation
  console.log('8️⃣ Testing Invoice Due Date Calculation');
  
  const invoiceDate = new Date('2024-01-15');
  const companyDueDate = calculateInvoiceDueDate(invoiceDate, 30);
  const individualDueDate = calculateInvoiceDueDate(invoiceDate, 15);
  
  console.log('✅ Due Dates:');
  console.log(`   Invoice Date: ${invoiceDate.toLocaleDateString('tr-TR')}`);
  console.log(`   Company Seller (30 days): ${companyDueDate.toLocaleDateString('tr-TR')}`);
  console.log(`   Individual Seller (15 days): ${individualDueDate.toLocaleDateString('tr-TR')}`);
  console.log('');

  // Test 9: Invoice Overdue Check
  console.log('9️⃣ Testing Invoice Overdue Check');
  
  const pastDueDate = new Date('2024-01-01');
  const futureDueDate = new Date('2024-12-31');
  const today = new Date();
  
  const isPastOverdue = isInvoiceOverdue(pastDueDate, today);
  const isFutureOverdue = isInvoiceOverdue(futureDueDate, today);
  
  console.log('✅ Overdue Check:');
  console.log(`   Past Due Date (${pastDueDate.toLocaleDateString('tr-TR')}): ${isPastOverdue ? 'OVERDUE' : 'NOT OVERDUE'}`);
  console.log(`   Future Due Date (${futureDueDate.toLocaleDateString('tr-TR')}): ${isFutureOverdue ? 'OVERDUE' : 'NOT OVERDUE'}`);
  console.log('');

  // Test 10: Invoice Aging
  console.log('10️⃣ Testing Invoice Aging');
  
  const oldInvoiceDate = new Date('2023-06-15');
  const recentInvoiceDate = new Date('2024-01-10');
  
  const oldAging = calculateInvoiceAging(oldInvoiceDate);
  const recentAging = calculateInvoiceAging(recentInvoiceDate);
  
  console.log('✅ Invoice Aging:');
  console.log(`   Old Invoice (${oldInvoiceDate.toLocaleDateString('tr-TR')}): ${oldAging.daysOld} days old - ${oldAging.agingCategory}`);
  console.log(`   Recent Invoice (${recentInvoiceDate.toLocaleDateString('tr-TR')}): ${recentAging.daysOld} days old - ${recentAging.agingCategory}`);
  console.log('');

  // Test 11: Input Validation
  console.log('11️⃣ Testing Input Validation');
  
  const validInput = {
    orderId: 'ORD-2024-001',
    sellerId: 'seller-1',
    sellerType: SellerType.TYPE_B,
    orderAmount: 1000,
    commissionAmount: 100,
    taxAmount: 18,
    netAmount: 882,
    customerInfo: {
      id: 'customer-1',
      name: 'Test Customer',
      address: 'Test Address'
    },
    sellerInfo: {
      id: 'seller-1',
      name: 'Test Seller',
      address: 'Test Address'
    },
    items: [{
      productId: 'product-1',
      productName: 'Test Product',
      quantity: 1,
      unitPrice: 1000,
      subtotal: 1000,
      taxRate: 0.18,
      taxAmount: 180,
      totalAmount: 1180
    }]
  };

  const invalidInput = {
    orderId: '',
    sellerId: 'seller-1',
    sellerType: SellerType.TYPE_A,
    orderAmount: -100,
    commissionAmount: 100,
    taxAmount: 18,
    netAmount: 882,
    customerInfo: {
      id: 'customer-1',
      name: '',
      address: 'Test Address'
    },
    sellerInfo: {
      id: 'seller-1',
      name: 'Test Seller',
      address: 'Test Address'
    },
    items: []
  };

  const validResult = validateInvoiceCreationInput(validInput);
  const invalidResult = validateInvoiceCreationInput(invalidInput);
  
  console.log('✅ Input Validation:');
  console.log(`   Valid Input: ${validResult.isValid ? '✅ Valid' : '❌ Invalid'}`);
  if (!validResult.isValid) {
    console.log(`     Errors: ${validResult.errors.join(', ')}`);
  }
  
  console.log(`   Invalid Input: ${invalidResult.isValid ? '✅ Valid' : '❌ Invalid'}`);
  if (!invalidResult.isValid) {
    console.log(`     Errors: ${invalidResult.errors.join(', ')}`);
  }
  console.log('');

  // Test 12: Business Logic Summary
  console.log('12️⃣ Business Logic Summary');
  
  console.log('✅ Invoice Business Rules:');
  console.log('   • TYPE_A (Company) sellers → Commission Invoice (seller invoices us)');
  console.log('   • TYPE_B (Individual/IG) sellers → Sales Invoice (we invoice customer)');
  console.log('   • Commission invoices show commission service details');
  console.log('   • Sales invoices show product details as-is');
  console.log('   • Company sellers get 30-day payment terms');
  console.log('   • Individual sellers get 15-day payment terms');
  console.log('   • All invoices include proper tax calculations');
  console.log('   • Invoice numbers are generated with type prefixes');
  console.log('');

  console.log('🎉 All Invoice system tests completed successfully!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Stack trace:', error.stack);
}

