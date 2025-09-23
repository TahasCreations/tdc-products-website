const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel production build...');

try {
  // 1. Environment check
  console.log('🔍 Checking environment...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    console.warn('⚠️ Build will continue but may fail at runtime');
  }

  // 2. Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  const dirsToClean = ['.next', 'out', 'node_modules/.cache'];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        if (process.platform === 'win32') {
          execSync(`rmdir /s /q ${dir}`, { stdio: 'inherit' });
        } else {
          execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
        }
        console.log(`✅ Cleaned ${dir}`);
      } catch (error) {
        console.warn(`⚠️ Could not clean ${dir}:`, error.message);
      }
    }
  });

  // 3. Install dependencies
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ npm install failed:', error.message);
    throw error;
  }

  // 4. Type check (skip for faster builds)
  console.log('🔍 Skipping type check for faster build...');
  
  // 5. Lint check (skip for faster builds)
  console.log('🔍 Skipping lint check for faster build...');

  // 6. Next.js build
  console.log('🏗️ Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  // 7. Verify build output
  console.log('🔍 Verifying build output...');
  if (fs.existsSync('.next')) {
    console.log('✅ Build output directory created');
  } else {
    throw new Error('Build output directory not found');
  }

  // 8. Check for critical files
  const criticalFiles = [
    '.next/static',
    '.next/server',
    '.next/BUILD_ID'
  ];

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found ${file}`);
    } else {
      console.warn(`⚠️ Missing ${file}`);
    }
  });

  console.log('🎉 Vercel production build completed successfully!');
  console.log('📊 Build summary:');
  console.log(`   - Build directory: .next`);
  console.log(`   - Node version: ${process.version}`);
  console.log(`   - Platform: ${process.platform}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('📋 Troubleshooting steps:');
  console.error('   1. Check environment variables');
  console.error('   2. Verify all dependencies are installed');
  console.error('   3. Check for TypeScript errors');
  console.error('   4. Verify Next.js configuration');
  process.exit(1);
}
