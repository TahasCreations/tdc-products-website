#!/usr/bin/env node

/**
 * Fix Build Issues Script
 * TDC Market - E-commerce Platform
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Build Issues...\n');

// Fix 1: Create missing directories
console.log('1. Creating missing directories...');
const dirs = [
  'apps/web/.next',
  'apps/web/public/images',
  'apps/web/public/images/categories',
  'apps/web/public/images/products',
  'apps/web/public/images/collections',
  'apps/web/public/images/stores',
  'apps/web/public/images/blog'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   ✅ Created ${dir}`);
  } else {
    console.log(`   ✅ ${dir} already exists`);
  }
});

// Fix 2: Create missing image files
console.log('\n2. Creating placeholder images...');
const images = [
  'apps/web/public/images/categories/3d-figures.jpg',
  'apps/web/public/images/categories/desktop-accessories.jpg',
  'apps/web/public/images/categories/gift-items.jpg',
  'apps/web/public/images/categories/collectibles.jpg',
  'apps/web/public/images/categories/educational-toys.jpg',
  'apps/web/public/images/categories/decorative-objects.jpg',
  'apps/web/public/images/products/anime-figure.jpg',
  'apps/web/public/images/products/desk-lamp.jpg',
  'apps/web/public/images/products/cat-figure.jpg',
  'apps/web/public/images/products/plant-pot.jpg',
  'apps/web/public/images/collections/trending.jpg',
  'apps/web/public/images/collections/local-designers.jpg',
  'apps/web/public/images/collections/limited-figures.jpg',
  'apps/web/public/images/collections/gift-guide.jpg',
  'apps/web/public/images/stores/artisan-craft.jpg',
  'apps/web/public/images/stores/tech-gadgets.jpg',
  'apps/web/public/images/stores/nature-craft.jpg',
  'apps/web/public/images/blog/3d-printing.jpg',
  'apps/web/public/images/blog/home-decoration.jpg',
  'apps/web/public/images/blog/gift-selection.jpg'
];

images.forEach(image => {
  if (!fs.existsSync(image)) {
    // Create a simple placeholder file
    fs.writeFileSync(image, '');
    console.log(`   ✅ Created placeholder ${image}`);
  } else {
    console.log(`   ✅ ${image} already exists`);
  }
});

// Fix 3: Create missing manifest files
console.log('\n3. Creating manifest files...');
const manifest = {
  name: 'TDC Market',
  short_name: 'TDC Market',
  description: 'Türkiye\'nin Tasarım & Figür Pazarı',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#5A63F2',
  icons: [
    {
      src: '/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

if (!fs.existsSync('apps/web/public/manifest.json')) {
  fs.writeFileSync('apps/web/public/manifest.json', JSON.stringify(manifest, null, 2));
  console.log('   ✅ Created manifest.json');
} else {
  console.log('   ✅ manifest.json already exists');
}

// Fix 4: Create missing icon files
console.log('\n4. Creating icon files...');
const icons = [
  'apps/web/public/icon-192x192.png',
  'apps/web/public/icon-512x512.png',
  'apps/web/public/favicon.ico'
];

icons.forEach(icon => {
  if (!fs.existsSync(icon)) {
    // Create a simple placeholder file
    fs.writeFileSync(icon, '');
    console.log(`   ✅ Created placeholder ${icon}`);
  } else {
    console.log(`   ✅ ${icon} already exists`);
  }
});

// Fix 5: Create missing robots.txt
console.log('\n5. Creating robots.txt...');
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://tdcmarket.com/sitemap.xml
`;

if (!fs.existsSync('apps/web/public/robots.txt')) {
  fs.writeFileSync('apps/web/public/robots.txt', robotsTxt);
  console.log('   ✅ Created robots.txt');
} else {
  console.log('   ✅ robots.txt already exists');
}

// Fix 6: Create missing sitemap.xml
console.log('\n6. Creating sitemap.xml...');
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tdcmarket.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tdcmarket.com/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tdcmarket.com/become-seller</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

if (!fs.existsSync('apps/web/public/sitemap.xml')) {
  fs.writeFileSync('apps/web/public/sitemap.xml', sitemapXml);
  console.log('   ✅ Created sitemap.xml');
} else {
  console.log('   ✅ sitemap.xml already exists');
}

// Fix 7: Create missing OG image
console.log('\n7. Creating OG image...');
if (!fs.existsSync('apps/web/public/og-image.jpg')) {
  fs.writeFileSync('apps/web/public/og-image.jpg', '');
  console.log('   ✅ Created placeholder og-image.jpg');
} else {
  console.log('   ✅ og-image.jpg already exists');
}

console.log('\n✅ All build issues fixed!');
console.log('\n📝 Next steps:');
console.log('1. Run: cd apps/web && npm install');
console.log('2. Run: npm run build');
console.log('3. Deploy to Vercel! 🚀');
