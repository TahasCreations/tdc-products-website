#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel production build...');

try {
  // 1. Environment check
  console.log('🔍 Checking environment...');
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL not set');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY not set');
  }

  // 2. Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  const dirsToClean = ['.next', 'out', 'node_modules/.cache'];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q ${dir}`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
      }
    }
  });

  // 3. Install dependencies (skip if already installed)
  console.log('📦 Checking dependencies...');
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  } else {
    console.log('✅ Dependencies already installed');
  }

  // 4. Type check
  console.log('🔍 Running type check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });

  // 5. Lint check
  console.log('🔍 Running lint check...');
  execSync('npx next lint', { stdio: 'inherit' });

  // 6. Build the application
  console.log('🏗️ Building application...');
  execSync('npx next build', { stdio: 'inherit' });

  // 7. Verify build output
  console.log('✅ Verifying build output...');
  if (!fs.existsSync('.next')) {
    throw new Error('Build failed: .next directory not found');
  }

  // 8. Check bundle size
  console.log('📊 Analyzing bundle size...');
  const buildStats = execSync('npx next build --debug', { encoding: 'utf8' });
  
  // Extract bundle size info
  const bundleSizeMatch = buildStats.match(/First Load JS shared by all\s+(\d+\.?\d*)\s+kB/);
  if (bundleSizeMatch) {
    const bundleSize = parseFloat(bundleSizeMatch[1]);
    console.log(`📦 Bundle size: ${bundleSize} kB`);
    
    if (bundleSize > 200) {
      console.warn('⚠️ Bundle size is large, consider optimization');
    }
  }

  // 9. Generate build report
  console.log('📋 Generating build report...');
  const buildReport = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    vercel: !!process.env.VERCEL,
    buildTime: Date.now(),
    bundleSize: bundleSizeMatch ? parseFloat(bundleSizeMatch[1]) : 'unknown'
  };

  fs.writeFileSync('.next/build-report.json', JSON.stringify(buildReport, null, 2));

  console.log('🎉 Vercel build completed successfully!');
  console.log('📊 Build Report:');
  console.log(`   Environment: ${buildReport.environment}`);
  console.log(`   Vercel: ${buildReport.vercel}`);
  console.log(`   Bundle Size: ${buildReport.bundleSize} kB`);
  console.log(`   Build Time: ${new Date(buildReport.buildTime).toLocaleString()}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
