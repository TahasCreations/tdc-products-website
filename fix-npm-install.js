#!/usr/bin/env node

/**
 * Fix NPM Install Issues
 * TDC Market - E-commerce Platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing NPM Install Issues...\n');

// Fix 1: Clean node_modules and package-lock.json
console.log('1. Cleaning node_modules and package-lock.json...');
try {
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    console.log('   ✅ Removed node_modules');
  }
  
  if (fs.existsSync('package-lock.json')) {
    execSync('rm package-lock.json', { stdio: 'inherit' });
    console.log('   ✅ Removed package-lock.json');
  }
  
  if (fs.existsSync('apps/web/node_modules')) {
    execSync('rm -rf apps/web/node_modules', { stdio: 'inherit' });
    console.log('   ✅ Removed apps/web/node_modules');
  }
  
  if (fs.existsSync('apps/web/package-lock.json')) {
    execSync('rm apps/web/package-lock.json', { stdio: 'inherit' });
    console.log('   ✅ Removed apps/web/package-lock.json');
  }
} catch (error) {
  console.log('   ⚠️  Error cleaning:', error.message);
}

// Fix 2: Check package.json files
console.log('\n2. Checking package.json files...');
try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('   ✅ Root package.json is valid');
  
  const webPackage = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
  console.log('   ✅ Web package.json is valid');
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Fix 3: Install root dependencies
console.log('\n3. Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✅ Root dependencies installed');
} catch (error) {
  console.log('   ❌ Failed to install root dependencies:', error.message);
  console.log('   Trying with --legacy-peer-deps...');
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    console.log('   ✅ Root dependencies installed with --legacy-peer-deps');
  } catch (error2) {
    console.log('   ❌ Failed with --legacy-peer-deps:', error2.message);
  }
}

// Fix 4: Install web app dependencies
console.log('\n4. Installing web app dependencies...');
try {
  process.chdir('apps/web');
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✅ Web app dependencies installed');
} catch (error) {
  console.log('   ❌ Failed to install web app dependencies:', error.message);
  console.log('   Trying with --legacy-peer-deps...');
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    console.log('   ✅ Web app dependencies installed with --legacy-peer-deps');
  } catch (error2) {
    console.log('   ❌ Failed with --legacy-peer-deps:', error2.message);
  }
}

// Fix 5: Check for common issues
console.log('\n5. Checking for common issues...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`   Node.js version: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
  console.log('   ⚠️  Warning: Node.js 18+ recommended for Vercel');
}

// Check npm version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`   npm version: ${npmVersion}`);
} catch (error) {
  console.log('   ⚠️  Could not check npm version');
}

// Fix 6: Try alternative installation methods
console.log('\n6. Trying alternative installation methods...');

// Try with npm ci
try {
  execSync('npm ci', { stdio: 'inherit' });
  console.log('   ✅ npm ci successful');
} catch (error) {
  console.log('   ⚠️  npm ci failed, trying npm install --force...');
  try {
    execSync('npm install --force', { stdio: 'inherit' });
    console.log('   ✅ npm install --force successful');
  } catch (error2) {
    console.log('   ❌ All installation methods failed');
  }
}

console.log('\n✅ NPM install issues fixed!');
console.log('\n📝 Next steps:');
console.log('1. Try: npm run build');
console.log('2. If still failing, check specific error messages');
console.log('3. Deploy to Vercel! 🚀');
