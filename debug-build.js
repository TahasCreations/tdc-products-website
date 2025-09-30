#!/usr/bin/env node

/**
 * Debug Build Script
 * TDC Market - E-commerce Platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Build Issues...\n');

// Check 1: Node.js version
console.log('1. Checking Node.js version...');
const nodeVersion = process.version;
console.log(`   Node.js: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
  console.log('   ⚠️  Warning: Node.js 18+ recommended');
}

// Check 2: Package.json
console.log('\n2. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   Next.js: ${packageJson.dependencies.next}`);
  console.log(`   React: ${packageJson.dependencies.react}`);
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message);
}

// Check 3: TypeScript config
console.log('\n3. Checking TypeScript config...');
try {
  const tsConfig = JSON.parse(fs.readFileSync('apps/web/tsconfig.json', 'utf8'));
  console.log('   ✅ tsconfig.json is valid');
  console.log(`   Target: ${tsConfig.compilerOptions.target || 'default'}`);
  console.log(`   Module: ${tsConfig.compilerOptions.module}`);
} catch (error) {
  console.log('   ❌ Error reading tsconfig.json:', error.message);
}

// Check 4: Next.js config
console.log('\n4. Checking Next.js config...');
try {
  const nextConfig = require('./apps/web/next.config.js');
  console.log('   ✅ next.config.js is valid');
  console.log(`   Output: ${nextConfig.output || 'default'}`);
  console.log(`   SWC Minify: ${nextConfig.swcMinify || false}`);
} catch (error) {
  console.log('   ❌ Error reading next.config.js:', error.message);
}

// Check 5: Tailwind config
console.log('\n5. Checking Tailwind config...');
try {
  const tailwindConfig = require('./apps/web/tailwind.config.ts');
  console.log('   ✅ tailwind.config.ts is valid');
  console.log(`   Content paths: ${tailwindConfig.content.length} patterns`);
} catch (error) {
  console.log('   ❌ Error reading tailwind.config.ts:', error.message);
}

// Check 6: Source files
console.log('\n6. Checking source files...');
const sourceFiles = [
  'apps/web/src/app/page.tsx',
  'apps/web/src/app/layout.tsx',
  'apps/web/src/data/seed.ts',
  'apps/web/src/components/home/Hero.tsx',
  'apps/web/src/components/home/CategoryGrid.tsx',
  'apps/web/src/components/home/CollectionStrip.tsx',
  'apps/web/src/components/home/CouponBanner.tsx',
  'apps/web/src/components/home/StoreSpotlight.tsx',
  'apps/web/src/components/home/TrustSection.tsx',
  'apps/web/src/components/home/BlogSection.tsx',
  'apps/web/src/components/home/AnnouncementBar.tsx'
];

let missingFiles = 0;
for (const file of sourceFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} missing`);
    missingFiles++;
  }
}

if (missingFiles > 0) {
  console.log(`   ⚠️  ${missingFiles} files missing`);
}

// Check 7: Dependencies
console.log('\n7. Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'tailwindcss',
    'autoprefixer',
    'postcss'
  ];
  
  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`   ✅ ${dep}`);
    } else {
      console.log(`   ❌ ${dep} missing`);
    }
  }
} catch (error) {
  console.log('   ❌ Error checking dependencies:', error.message);
}

// Check 8: Try to install dependencies
console.log('\n8. Installing dependencies...');
try {
  process.chdir('apps/web');
  execSync('npm install', { stdio: 'pipe' });
  console.log('   ✅ Dependencies installed successfully');
} catch (error) {
  console.log('   ❌ Failed to install dependencies:', error.message);
}

// Check 9: Try to build
console.log('\n9. Attempting build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build successful!');
} catch (error) {
  console.log('   ❌ Build failed:', error.message);
  console.log('   Error output:', error.stdout?.toString() || 'No output');
}

console.log('\n🔍 Debug complete!');
