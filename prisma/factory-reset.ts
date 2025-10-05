#!/usr/bin/env tsx

/**
 * Factory Reset Script
 * 
 * This script performs a complete factory reset by:
 * 1. Deleting all database tables (including NextAuth tables)
 * 2. Cleaning GCS bucket (uploads/, products/, demo/, temp/)
 * 
 * ⚠️  WARNING: This will permanently delete ALL data!
 * Make sure to backup your data before running this script.
 */

import { PrismaClient } from '@prisma/client';
import { Storage } from '@google-cloud/storage';
import * as readline from 'readline';

// Environment variables validation
const requiredEnvVars = [
  'GCP_PROJECT_ID',
  'GCP_CLIENT_EMAIL', 
  'GCP_PRIVATE_KEY',
  'GCS_BUCKET',
  'FACTORY_RESET',
  'FACTORY_RESET_CONFIRM'
];

// Check required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Validate factory reset confirmation
if (process.env.FACTORY_RESET !== 'I_UNDERSTAND') {
  console.error('❌ FACTORY_RESET must be set to "I_UNDERSTAND"');
  process.exit(1);
}

if (!process.env.FACTORY_RESET_CONFIRM) {
  console.error('❌ FACTORY_RESET_CONFIRM must be set');
  process.exit(1);
}

// Production protection
const isProduction = process.env.NODE_ENV === 'production';
const hasForceFlag = process.argv.includes('--force');
const isDryRun = process.argv.includes('--dry');

if (isProduction && !hasForceFlag) {
  console.error('❌ Cannot run factory reset in production without --force flag');
  process.exit(1);
}

// Additional confirmation for production with --force
async function getProductionConfirmation(): Promise<boolean> {
  if (!isProduction || !hasForceFlag) return true;
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`⚠️  PRODUCTION MODE: Type "${process.env.FACTORY_RESET_CONFIRM}" to confirm: `, (answer) => {
      rl.close();
      resolve(answer === process.env.FACTORY_RESET_CONFIRM);
    });
  });
}

// Database models in deletion order (child → parent)
const dbModels = [
  // Reklam & sıralama
  'AdClick',
  'AdCampaign', 
  'KeywordRank',
  
  // Sipariş/muhasebe
  'OrderItem',
  'Order',
  'Cart',
  'LedgerEntry',
  'Invoice',
  
  // Influencer
  'CollaborationMessage',
  'Collaboration',
  'InfluencerRate',
  'InfluencerProfile',
  
  // İçerik
  'BlogPost',
  'Notification',
  'PushToken',
  
  // Mağaza
  'StoreTheme',
  'StoreDomain',
  'Subscription',
  'SellerProfile',
  
  // Ürün
  'ProductImage',
  'Product',
  'Collection',
  'Category',
  
  // NextAuth
  'Account',
  'Session',
  'VerificationToken',
  'User'
];

// GCS prefixes to clean
const gcsPrefixes = ['uploads/', 'products/', 'demo/', 'temp/'];

async function main() {
  console.log('🏭 Factory Reset Script Starting...\n');
  
  // Production confirmation
  const confirmed = await getProductionConfirmation();
  if (!confirmed) {
    console.error('❌ Production confirmation failed');
    process.exit(1);
  }
  
  const prisma = new PrismaClient();
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });
  
  const bucket = storage.bucket(process.env.GCS_BUCKET!);
  
  try {
    if (isDryRun) {
      console.log('🔍 DRY RUN MODE - No data will be deleted\n');
      
      // Database counts
      console.log('📊 Database Records:');
      for (const model of dbModels) {
        try {
          const count = await (prisma as any)[model.toLowerCase()].count();
          console.log(`  ${model}: ${count} records`);
        } catch (error) {
          console.log(`  ${model}: Model not found`);
        }
      }
      
      // GCS counts
      console.log('\n📦 GCS Objects:');
      for (const prefix of gcsPrefixes) {
        try {
          const [files] = await bucket.getFiles({ prefix });
          console.log(`  ${prefix}: ${files.length} objects`);
        } catch (error) {
          console.log(`  ${prefix}: Error checking`);
        }
      }
      
      console.log('\n✅ Dry run completed - no data was deleted');
      return;
    }
    
    console.log('⚠️  WARNING: This will permanently delete ALL data!\n');
    
    // Database cleanup
    console.log('🗄️  Cleaning database...');
    const deletedCounts: Record<string, number> = {};
    
    await prisma.$transaction(async (tx) => {
      for (const model of dbModels) {
        try {
          const modelInstance = (tx as any)[model.toLowerCase()];
          if (modelInstance && typeof modelInstance.deleteMany === 'function') {
            const result = await modelInstance.deleteMany({});
            deletedCounts[model] = result.count;
            console.log(`  ✅ ${model}: ${result.count} records deleted`);
          }
        } catch (error) {
          console.log(`  ⚠️  ${model}: Model not found or error - skipped`);
        }
      }
    });
    
    // Try PostgreSQL TRUNCATE if available
    try {
      await prisma.$executeRaw`TRUNCATE TABLE ${dbModels.map(m => `"${m}"`).join(', ')} RESTART IDENTITY CASCADE`;
      console.log('  ✅ PostgreSQL TRUNCATE executed');
    } catch (error) {
      console.log('  ⚠️  PostgreSQL TRUNCATE not available - skipped');
    }
    
    // GCS cleanup
    console.log('\n☁️  Cleaning GCS bucket...');
    const gcsDeletedCounts: Record<string, number> = {};
    
    for (const prefix of gcsPrefixes) {
      try {
        const [files] = await bucket.getFiles({ prefix });
        if (files.length > 0) {
          await Promise.all(files.map(file => file.delete()));
          gcsDeletedCounts[prefix] = files.length;
          console.log(`  ✅ ${prefix}: ${files.length} objects deleted`);
        } else {
          console.log(`  ℹ️  ${prefix}: No objects found`);
        }
      } catch (error) {
        console.log(`  ⚠️  ${prefix}: Error cleaning - skipped`);
      }
    }
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log('Database:');
    const totalDbRecords = Object.values(deletedCounts).reduce((sum, count) => sum + count, 0);
    Object.entries(deletedCounts).forEach(([model, count]) => {
      console.log(`  ${model}: ${count} records`);
    });
    console.log(`  Total: ${totalDbRecords} database records deleted`);
    
    console.log('\nGCS:');
    const totalGcsObjects = Object.values(gcsDeletedCounts).reduce((sum, count) => sum + count, 0);
    Object.entries(gcsDeletedCounts).forEach(([prefix, count]) => {
      console.log(`  ${prefix}: ${count} objects`);
    });
    console.log(`  Total: ${totalGcsObjects} GCS objects deleted`);
    
    console.log('\n🎉 Factory reset completed successfully!');
    console.log('💡 Your application is now in a clean 0-state.');
    
  } catch (error) {
    console.error('❌ Factory reset failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Factory reset interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Factory reset terminated');
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
