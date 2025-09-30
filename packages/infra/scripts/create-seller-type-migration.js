/**
 * Script to create Prisma migration for Seller type changes
 * Run with: node packages/infra/scripts/create-seller-type-migration.js
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Creating Prisma migration for Seller type changes...');

try {
  // Change to the infra package directory
  const infraDir = path.join(__dirname, '..');
  process.chdir(infraDir);

  // Create migration
  console.log('📝 Creating migration...');
  execSync('npx prisma migrate dev --name add-seller-type-and-commission-fields', {
    stdio: 'inherit',
    cwd: infraDir
  });

  console.log('✅ Migration created successfully!');
  console.log('');
  console.log('📋 Migration includes:');
  console.log('  - Added SellerType enum (TYPE_A, TYPE_B)');
  console.log('  - Added sellerType field to Seller model');
  console.log('  - Added taxNumber, taxOffice, address fields for TYPE_A');
  console.log('  - Added instagramHandle field for TYPE_B');
  console.log('  - Added phone, email, bankAccount, iban fields');
  console.log('  - Added isInvoiceEligible field');
  console.log('  - Updated commissionRate to be calculated based on type');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

