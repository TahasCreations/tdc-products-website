#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // 1. Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // 2. Type check
  console.log('🔍 Running type check...');
  execSync('npm run type-check', { stdio: 'inherit' });

  // 3. Lint check
  console.log('🔍 Running lint check...');
  execSync('npm run lint', { stdio: 'inherit' });

  // 4. Build the application
  console.log('🏗️ Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // 5. Verify build output
  console.log('✅ Verifying build output...');
  if (!fs.existsSync('.next')) {
    throw new Error('Build failed: .next directory not found');
  }

  // 6. Check for critical files
  const criticalFiles = [
    '.next/static',
    '.next/server',
    '.next/standalone'
  ];

  for (const file of criticalFiles) {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️ Warning: ${file} not found`);
    }
  }

  console.log('🎉 Vercel build completed successfully!');
  console.log('📊 Build statistics:');
  
  // Get build size
  const buildSize = execSync('du -sh .next', { encoding: 'utf8' });
  console.log(`📦 Build size: ${buildSize.trim()}`);

  // Get page count
  const pages = fs.readdirSync('.next/server/app', { recursive: true })
    .filter(file => file.endsWith('.js'))
    .length;
  console.log(`📄 Pages built: ${pages}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

