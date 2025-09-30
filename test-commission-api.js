/**
 * Test script for Commission API endpoints
 * Run with: node test-commission-api.js
 */

const API_BASE_URL = 'http://localhost:3002';

async function testCommissionAPI() {
  console.log('🧪 Testing Commission API...\n');

  try {
    // Test 1: Get commission rates
    console.log('1️⃣ Testing GET /api/commission/rates');
    const ratesResponse = await fetch(`${API_BASE_URL}/api/commission/rates`);
    const ratesData = await ratesResponse.json();
    console.log('✅ Commission rates:', JSON.stringify(ratesData, null, 2));
    console.log('');

    // Test 2: Calculate commission for TYPE_A seller
    console.log('2️⃣ Testing POST /api/commission/calculate (TYPE_A - 1000 TL)');
    const typeAResponse = await fetch(`${API_BASE_URL}/api/commission/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderAmount: 1000,
        sellerType: 'TYPE_A'
      })
    });
    const typeAData = await typeAResponse.json();
    console.log('✅ TYPE_A Commission (1000 TL):', JSON.stringify(typeAData, null, 2));
    console.log('');

    // Test 3: Calculate commission for TYPE_B seller
    console.log('3️⃣ Testing POST /api/commission/calculate (TYPE_B - 1000 TL)');
    const typeBResponse = await fetch(`${API_BASE_URL}/api/commission/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderAmount: 1000,
        sellerType: 'TYPE_B'
      })
    });
    const typeBData = await typeBResponse.json();
    console.log('✅ TYPE_B Commission (1000 TL):', JSON.stringify(typeBData, null, 2));
    console.log('');

    // Test 4: Calculate commission for multiple items
    console.log('4️⃣ Testing POST /api/commission/calculate-multiple');
    const multipleResponse = await fetch(`${API_BASE_URL}/api/commission/calculate-multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          { amount: 500, sellerType: 'TYPE_A' },
          { amount: 300, sellerType: 'TYPE_B' },
          { amount: 200, sellerType: 'TYPE_A' }
        ]
      })
    });
    const multipleData = await multipleResponse.json();
    console.log('✅ Multiple Items Commission:', JSON.stringify(multipleData, null, 2));
    console.log('');

    // Test 5: Calculate commission for a real order
    console.log('5️⃣ Testing POST /api/commission/calculate-order');
    const orderResponse = await fetch(`${API_BASE_URL}/api/commission/calculate-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sellerType: 'TYPE_A',
        orderItems: [
          {
            productId: 'prod-1',
            productName: 'Ürün 1',
            quantity: 2,
            unitPrice: 250
          },
          {
            productId: 'prod-2',
            productName: 'Ürün 2',
            quantity: 1,
            unitPrice: 500
          }
        ]
      })
    });
    const orderData = await orderResponse.json();
    console.log('✅ Order Commission:', JSON.stringify(orderData, null, 2));
    console.log('');

    // Test 6: Get commission examples
    console.log('6️⃣ Testing GET /api/commission/examples');
    const examplesResponse = await fetch(`${API_BASE_URL}/api/commission/examples`);
    const examplesData = await examplesResponse.json();
    console.log('✅ Commission Examples:', JSON.stringify(examplesData, null, 2));
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testCommissionAPI();

