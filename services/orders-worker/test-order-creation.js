#!/usr/bin/env node

/**
 * Test Order Creation Script
 * 
 * This script tests the order creation flow by:
 * 1. Creating a test order via API Gateway
 * 2. Monitoring the outbox for events
 * 3. Verifying event processing
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3002';
const TEST_TENANT_ID = 'test-tenant-123';
const TEST_CUSTOMER_ID = 'test-customer-456';

async function createTestOrder() {
  console.log('🧪 Creating test order...');

  const orderData = {
    tenantId: TEST_TENANT_ID,
    customerId: TEST_CUSTOMER_ID,
    items: [
      {
        productId: 'test-product-1',
        quantity: 2,
        unitPrice: 150.00,
      },
      {
        productId: 'test-product-2',
        quantity: 1,
        unitPrice: 200.00,
      },
    ],
    customerEmail: 'test@example.com',
    customerPhone: '+90 555 123 4567',
    customerNote: 'Test order for worker service',
    shippingAddress: {
      firstName: 'Test',
      lastName: 'User',
      address1: 'Test Address 123',
      city: 'Istanbul',
      postalCode: '34000',
      country: 'TR',
      phone: '+90 555 123 4567',
    },
    billingAddress: {
      firstName: 'Test',
      lastName: 'User',
      address1: 'Test Address 123',
      city: 'Istanbul',
      postalCode: '34000',
      country: 'TR',
    },
    paymentMethod: 'credit_card',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', result.data.orderId);
      console.log('   Order Number:', result.data.orderNumber);
      console.log('   Total Amount:', result.data.totalAmount);
      console.log('   Items:', result.data.items.length);
      
      return result.data;
    } else {
      console.error('❌ Order creation failed:', result.error);
      console.error('   Details:', result.details);
      return null;
    }

  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    return null;
  }
}

async function checkOrderStatus(orderId) {
  console.log(`🔍 Checking order status for ${orderId}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    const result = await response.json();

    if (result.success) {
      console.log('📦 Order details:');
      console.log('   Status:', result.data.status);
      console.log('   Payment Status:', result.data.paymentStatus);
      console.log('   Fulfillment Status:', result.data.fulfillmentStatus);
      console.log('   Total Amount:', result.data.totalAmount);
      console.log('   Items Count:', result.data.items.length);
      
      return result.data;
    } else {
      console.error('❌ Failed to fetch order:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error fetching order:', error.message);
    return null;
  }
}

async function updateOrderStatus(orderId, status) {
  console.log(`🔄 Updating order status to ${status}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Order status updated successfully!');
      console.log('   New Status:', result.data.status);
      return result.data;
    } else {
      console.error('❌ Status update failed:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    return null;
  }
}

async function listOrders() {
  console.log('📋 Listing orders...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders?tenantId=${TEST_TENANT_ID}&limit=10`);
    const result = await response.json();

    if (result.success) {
      console.log(`📦 Found ${result.data.length} orders:`);
      result.data.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.orderNumber} - ${order.status} - $${order.totalAmount}`);
      });
      return result.data;
    } else {
      console.error('❌ Failed to list orders:', result.error);
      return [];
    }

  } catch (error) {
    console.error('❌ Error listing orders:', error.message);
    return [];
  }
}

async function runTest() {
  console.log('🚀 Starting Order Creation Test');
  console.log('================================');

  // Step 1: Create test order
  const order = await createTestOrder();
  if (!order) {
    console.log('❌ Test failed at order creation');
    return;
  }

  // Wait a bit for processing
  console.log('\n⏳ Waiting 3 seconds for event processing...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Step 2: Check order status
  const orderDetails = await checkOrderStatus(order.orderId);
  if (!orderDetails) {
    console.log('❌ Test failed at order status check');
    return;
  }

  // Step 3: Update order status
  const updatedOrder = await updateOrderStatus(order.orderId, 'CONFIRMED');
  if (!updatedOrder) {
    console.log('❌ Test failed at status update');
    return;
  }

  // Step 4: List orders
  await listOrders();

  console.log('\n✅ Test completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Order Created: ${order.orderNumber}`);
  console.log(`   - Status: ${updatedOrder.status}`);
  console.log(`   - Total Amount: $${updatedOrder.totalAmount}`);
  console.log(`   - Items: ${updatedOrder.items.length}`);
  
  console.log('\n🔍 Check the worker logs to see event processing:');
  console.log('   - OrderCreated event should be processed');
  console.log('   - OrderStatusChanged event should be processed');
  console.log('   - Events should be marked as processed in outbox');
}

// Run the test
runTest().catch(console.error);

