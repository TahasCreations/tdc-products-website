#!/usr/bin/env node

/**
 * Queue System Test Script
 * 
 * This script tests the queue-based background job system by:
 * 1. Testing image processing queue
 * 2. Testing report generation queue
 * 3. Testing sync queue
 * 4. Monitoring job status
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3002';
const TEST_TENANT_ID = 'test-tenant-123';
const TEST_USER_ID = 'test-user-456';

async function testImageProcessing() {
  console.log('🖼️ Testing Image Processing Queue...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: TEST_TENANT_ID,
        userId: TEST_USER_ID,
        imageUrl: 'https://example.com/test-image.jpg',
        imageId: 'test-image-123',
        operations: {
          resize: { width: 800, height: 600, quality: 85 },
          thumbnail: { width: 200, height: 200, quality: 80 },
          optimize: { quality: 90, format: 'webp' },
        },
        outputPath: 'images/processed',
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Image processing job queued:', result.data.jobId);
      return result.data.jobId;
    } else {
      console.error('❌ Image processing failed:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error testing image processing:', error.message);
    return null;
  }
}

async function testReportGeneration() {
  console.log('📊 Testing Report Generation Queue...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: TEST_TENANT_ID,
        userId: TEST_USER_ID,
        reportType: 'sales',
        dateRange: {
          start: '2024-01-01',
          end: '2024-01-31',
        },
        format: 'pdf',
        outputPath: 'reports/sales',
        emailRecipients: ['admin@example.com'],
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Report generation job queued:', result.data.jobId);
      return result.data.jobId;
    } else {
      console.error('❌ Report generation failed:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error testing report generation:', error.message);
    return null;
  }
}

async function testSync() {
  console.log('🔄 Testing Sync Queue...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/sync/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: TEST_TENANT_ID,
        userId: TEST_USER_ID,
        syncType: 'products',
        sourceSystem: 'shopify',
        targetSystem: 'woocommerce',
        batchSize: 50,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Sync job queued:', result.data.jobId);
      return result.data.jobId;
    } else {
      console.error('❌ Sync failed:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error testing sync:', error.message);
    return null;
  }
}

async function checkJobStatus(queueName, jobId) {
  console.log(`🔍 Checking ${queueName} job status: ${jobId}`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/status/${jobId}?queue=${queueName}`);
    const result = await response.json();

    if (result.success) {
      console.log(`📊 Job Status:`);
      console.log(`   State: ${result.data.state}`);
      console.log(`   Progress: ${result.data.progress}%`);
      console.log(`   Processed On: ${result.data.processedOn || 'Not started'}`);
      console.log(`   Finished On: ${result.data.finishedOn || 'Not finished'}`);
      
      if (result.data.result) {
        console.log(`   Result: ${JSON.stringify(result.data.result, null, 2)}`);
      }
      
      if (result.data.failedReason) {
        console.log(`   Failed Reason: ${result.data.failedReason}`);
      }

      return result.data;
    } else {
      console.error('❌ Failed to check job status:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error checking job status:', error.message);
    return null;
  }
}

async function getQueueStats() {
  console.log('📊 Getting Queue Statistics...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload/queues`);
    const result = await response.json();

    if (result.success) {
      console.log('📈 Queue Statistics:');
      Object.entries(result.data).forEach(([queueName, stats]) => {
        console.log(`   ${queueName}:`);
        console.log(`     Waiting: ${stats.waiting}, Active: ${stats.active}`);
        console.log(`     Completed: ${stats.completed}, Failed: ${stats.failed}`);
      });
      return result.data;
    } else {
      console.error('❌ Failed to get queue stats:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error getting queue stats:', error.message);
    return null;
  }
}

async function runTest() {
  console.log('🚀 Starting Queue System Test');
  console.log('================================');

  // Test 1: Image Processing
  const imageJobId = await testImageProcessing();
  
  // Test 2: Report Generation
  const reportJobId = await testReportGeneration();
  
  // Test 3: Sync
  const syncJobId = await testSync();

  // Wait a bit for processing
  console.log('\n⏳ Waiting 5 seconds for job processing...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check job statuses
  if (imageJobId) {
    await checkJobStatus('image-processing', imageJobId);
  }

  if (reportJobId) {
    await checkJobStatus('report-generation', reportJobId);
  }

  if (syncJobId) {
    await checkJobStatus('sync', syncJobId);
  }

  // Get queue stats
  await getQueueStats();

  console.log('\n✅ Queue System Test completed!');
  console.log('\n📋 Summary:');
  console.log(`   - Image Processing Job: ${imageJobId || 'Failed'}`);
  console.log(`   - Report Generation Job: ${reportJobId || 'Failed'}`);
  console.log(`   - Sync Job: ${syncJobId || 'Failed'}`);
  
  console.log('\n🔍 Check the background worker logs to see job processing:');
  console.log('   - Jobs should be processed by background workers');
  console.log('   - Check queue statistics for job counts');
  console.log('   - Monitor job status for completion');
}

// Run the test
runTest().catch(console.error);