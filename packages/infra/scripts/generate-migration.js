#!/usr/bin/env node

/**
 * Generate Prisma Migration Script
 * 
 * This script generates Prisma migrations for the database schema
 * Run with: node scripts/generate-migration.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Generating Prisma migration...');

try {
  // Set environment variables
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/tdc_market_dev';

  // Generate migration
  execSync('npx prisma migrate dev --name init', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });

  console.log('✅ Migration generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('   1. Review the generated migration files');
  console.log('   2. Run: pnpm db:migrate:deploy (for production)');
  console.log('   3. Run: pnpm db:seed (to populate with sample data)');

} catch (error) {
  console.error('❌ Migration generation failed:', error.message);
  process.exit(1);
}

