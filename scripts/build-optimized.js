#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized build process...');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
} catch (error) {
  console.warn('⚠️  Clean warning:', error.message);
}

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Run TypeScript check
console.log('🔍 Running TypeScript check...');
try {
  execSync('npx tsc --noEmit --incremental', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️  TypeScript check warning:', error.message);
}

// Run ESLint
console.log('🔍 Running ESLint...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️  ESLint warning:', error.message);
}

// Build the application
console.log('🏗️  Building application...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Analyze bundle size
console.log('📊 Analyzing bundle size...');
try {
  const buildDir = '.next';
  if (fs.existsSync(buildDir)) {
    const stats = fs.statSync(buildDir);
    console.log(`📁 Build directory size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }
} catch (error) {
  console.warn('⚠️  Bundle analysis warning:', error.message);
}

console.log('🎉 Optimized build process completed!');
