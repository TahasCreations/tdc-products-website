#!/usr/bin/env tsx
/**
 * Media Indexer Script
 * Scans codebase for image references and indexes them in the database
 * 
 * Usage:
 *   pnpm media:index           - Run full index
 *   pnpm media:index:dry       - Dry run (report only, no DB writes)
 */

import { PrismaClient, MediaStorage, MediaStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import sharp from 'sharp';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface ImageReference {
  url: string;
  file: string;
  line: number;
  component?: string;
  contextSnippet?: string;
}

interface IndexReport {
  totalFilesScanned: number;
  totalImagesFound: number;
  newImages: number;
  existingImages: number;
  missingImages: number;
  brokenReferences: number;
  errors: string[];
}

const isDryRun = process.argv.includes('--dry-run');
const WORKSPACE_ROOT = process.cwd();
const PUBLIC_DIR = path.join(WORKSPACE_ROOT, 'public');

// Scan patterns
const CODE_PATTERNS = [
  'app/**/*.{ts,tsx,js,jsx}',
  'components/**/*.{ts,tsx,js,jsx}',
  'pages/**/*.{ts,tsx,js,jsx}',
  'src/**/*.{ts,tsx,js,jsx}'
];

const CSS_PATTERNS = [
  'app/**/*.{css,scss}',
  'components/**/*.{css,scss}',
  'styles/**/*.{css,scss}',
  'src/**/*.{css,scss}'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.ico'];

async function main() {
  console.log('🔍 Media Indexer Starting...\n');
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no database writes)' : 'LIVE'}`);
  console.log(`Workspace: ${WORKSPACE_ROOT}\n`);

  const report: IndexReport = {
    totalFilesScanned: 0,
    totalImagesFound: 0,
    newImages: 0,
    existingImages: 0,
    missingImages: 0,
    brokenReferences: 0,
    errors: []
  };

  try {
    // 1. Scan public/ directory for images
    console.log('📂 Scanning public/ directory...');
    const publicImages = await scanPublicDirectory();
    console.log(`   Found ${publicImages.length} images in public/\n`);

    // 2. Scan code files for image references
    console.log('📝 Scanning code files for image references...');
    const codeReferences = await scanCodeFiles();
    report.totalFilesScanned = codeReferences.filesScanned;
    console.log(`   Scanned ${codeReferences.filesScanned} files`);
    console.log(`   Found ${codeReferences.references.length} image references\n`);

    // 3. Scan CSS files for url() references
    console.log('🎨 Scanning CSS files for url() references...');
    const cssReferences = await scanCSSFiles();
    console.log(`   Found ${cssReferences.length} CSS image references\n`);

    // 4. Combine all references
    const allReferences = [...codeReferences.references, ...cssReferences];
    const uniqueUrls = new Set<string>();
    const referenceMap = new Map<string, ImageReference[]>();

    for (const ref of allReferences) {
      uniqueUrls.add(ref.url);
      if (!referenceMap.has(ref.url)) {
        referenceMap.set(ref.url, []);
      }
      referenceMap.get(ref.url)!.push(ref);
    }

    report.totalImagesFound = uniqueUrls.size;

    // 5. Process each unique image
    console.log('💾 Processing and indexing images...');
    
    for (const imageUrl of uniqueUrls) {
      try {
        const references = referenceMap.get(imageUrl) || [];
        await processImage(imageUrl, references, publicImages, report);
      } catch (error) {
        report.errors.push(`Error processing ${imageUrl}: ${error.message}`);
      }
    }

    // 6. Check for orphaned/unused images
    console.log('\n🔎 Checking for unused images in public/...');
    const usedUrls = new Set(Array.from(uniqueUrls).map(url => normalizeUrl(url)));
    const unusedImages = publicImages.filter(img => !usedUrls.has(normalizeUrl(img)));
    
    if (unusedImages.length > 0) {
      console.log(`   ⚠️  Found ${unusedImages.length} unused images in public/`);
      if (!isDryRun) {
        // Mark them as existing but with empty usedIn
        for (const img of unusedImages.slice(0, 10)) { // Show only first 10
          console.log(`      - ${img}`);
        }
      }
    }

    // 7. Print report
    printReport(report);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function scanPublicDirectory(): Promise<string[]> {
  const images: string[] = [];
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn('   ⚠️  public/ directory not found');
    return images;
  }

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        const relativePath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
        images.push(`/${relativePath}`);
      }
    }
  }

  walkDir(PUBLIC_DIR);
  return images;
}

async function scanCodeFiles(): Promise<{ filesScanned: number; references: ImageReference[] }> {
  const references: ImageReference[] = [];
  let filesScanned = 0;

  for (const pattern of CODE_PATTERNS) {
    const files = await glob(pattern, { cwd: WORKSPACE_ROOT, ignore: ['node_modules/**', '.next/**', 'dist/**'] });
    
    for (const file of files) {
      filesScanned++;
      const filePath = path.join(WORKSPACE_ROOT, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileRefs = extractImageReferencesFromCode(content, file);
        references.push(...fileRefs);
      } catch (error) {
        // Skip files that can't be parsed
      }
    }
  }

  return { filesScanned, references };
}

function extractImageReferencesFromCode(content: string, filename: string): ImageReference[] {
  const references: ImageReference[] = [];
  
  // Simple regex patterns for common image references
  const patterns = [
    // <Image src="/..." or <img src="/..."
    /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|avif|ico))["']/gi,
    // import img from './...'
    /import\s+\w+\s+from\s+["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|avif))["']/gi,
    // backgroundImage: url(...)
    /url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|svg|webp|avif))["']?\)/gi,
  ];

  const lines = content.split('\n');

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    
    for (const pattern of patterns) {
      pattern.lastIndex = 0; // Reset regex
      let match;
      
      while ((match = pattern.exec(line)) !== null) {
        const url = match[1];
        
        references.push({
          url: normalizeUrl(url),
          file: filename,
          line: lineIndex + 1,
          contextSnippet: line.trim().substring(0, 100)
        });
      }
    }
  }

  return references;
}

async function scanCSSFiles(): Promise<ImageReference[]> {
  const references: ImageReference[] = [];

  for (const pattern of CSS_PATTERNS) {
    const files = await glob(pattern, { cwd: WORKSPACE_ROOT, ignore: ['node_modules/**', '.next/**'] });
    
    for (const file of files) {
      const filePath = path.join(WORKSPACE_ROOT, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const urlPattern = /url\(["']?([^"')]+\.(?:jpg|jpeg|png|gif|svg|webp|avif))["']?\)/gi;
        const lines = content.split('\n');

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          let match;
          
          while ((match = urlPattern.exec(line)) !== null) {
            references.push({
              url: normalizeUrl(match[1]),
              file,
              line: lineIndex + 1,
              contextSnippet: line.trim().substring(0, 100)
            });
          }
        }
      } catch (error) {
        // Skip
      }
    }
  }

  return references;
}

async function processImage(
  url: string,
  references: ImageReference[],
  publicImages: string[],
  report: IndexReport
) {
  const normalizedUrl = normalizeUrl(url);
  
  // Determine storage type
  let storage: MediaStorage = MediaStorage.LOCAL;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    storage = MediaStorage.REMOTE;
  } else if (process.env.MEDIA_STORAGE === 'gcs' && url.includes('storage.googleapis.com')) {
    storage = MediaStorage.GCS;
  }

  // Check if file exists
  let exists = false;
  let filePath: string | null = null;
  
  if (storage === MediaStorage.LOCAL) {
    filePath = path.join(PUBLIC_DIR, normalizedUrl.replace(/^\//, ''));
    exists = fs.existsSync(filePath);
  } else if (storage === MediaStorage.REMOTE) {
    // For remote, we'll check later if EXTERNAL_CHECK is enabled
    exists = true; // Assume exists for now
  }

  if (!exists) {
    report.brokenReferences++;
  }

  // Extract metadata
  let width: number | null = null;
  let height: number | null = null;
  let sizeBytes: number | null = null;
  let format: string | null = null;
  let dominantColor: string | null = null;

  if (exists && filePath && storage === MediaStorage.LOCAL) {
    try {
      const stats = fs.statSync(filePath);
      sizeBytes = stats.size;
      format = path.extname(filePath).substring(1).toLowerCase();

      // Try to get image dimensions using sharp
      if (format !== 'svg') {
        try {
          const metadata = await sharp(filePath).metadata();
          width = metadata.width || null;
          height = metadata.height || null;
          
          // Get dominant color
          const { dominant } = await sharp(filePath).stats();
          if (dominant) {
            dominantColor = `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`;
          }
        } catch (sharpError) {
          // Can't process with sharp (e.g., SVG)
        }
      }
    } catch (error) {
      // File stat error
    }
  }

  const usedIn = references.map(ref => ({
    file: ref.file,
    line: ref.line,
    component: ref.component,
    contextSnippet: ref.contextSnippet
  }));

  const filename = path.basename(normalizedUrl);
  const status = exists ? MediaStatus.ACTIVE : MediaStatus.MISSING;

  if (!isDryRun) {
    // Check if already exists
    const existing = await prisma.mediaAsset.findUnique({
      where: { url: normalizedUrl }
    });

    if (existing) {
      // Update existing
      await prisma.mediaAsset.update({
        where: { url: normalizedUrl },
        data: {
          usedIn: JSON.stringify(usedIn),
          width,
          height,
          format,
          sizeBytes,
          dominantColor,
          status,
          lastIndexedAt: new Date()
        }
      });
      report.existingImages++;
    } else {
      // Create new
      await prisma.mediaAsset.create({
        data: {
          url: normalizedUrl,
          storage,
          path: normalizedUrl,
          filename,
          width,
          height,
          format,
          sizeBytes,
          dominantColor,
          status,
          usedIn: JSON.stringify(usedIn),
          tags: JSON.stringify([])
        }
      });
      report.newImages++;
    }
  } else {
    // Dry run - just count
    const existing = await prisma.mediaAsset.findUnique({
      where: { url: normalizedUrl }
    });
    
    if (existing) {
      report.existingImages++;
    } else {
      report.newImages++;
    }
  }

  if (!exists) {
    report.missingImages++;
  }
}

function normalizeUrl(url: string): string {
  // Remove query params and fragments
  let normalized = url.split('?')[0].split('#')[0];
  
  // Handle relative paths
  if (!normalized.startsWith('http') && !normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  
  return normalized;
}

function printReport(report: IndexReport) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 INDEXING REPORT');
  console.log('='.repeat(60));
  console.log(`Files Scanned:       ${report.totalFilesScanned}`);
  console.log(`Total Images Found:  ${report.totalImagesFound}`);
  console.log(`New Images:          ${report.newImages} ✨`);
  console.log(`Existing Images:     ${report.existingImages} ♻️`);
  console.log(`Missing/Broken:      ${report.missingImages} ⚠️`);
  console.log(`Broken References:   ${report.brokenReferences} ❌`);
  
  if (report.errors.length > 0) {
    console.log(`\nErrors (${report.errors.length}):`);
    report.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
    if (report.errors.length > 10) {
      console.log(`  ... and ${report.errors.length - 10} more`);
    }
  }
  
  console.log('='.repeat(60));
  
  if (isDryRun) {
    console.log('\n💡 This was a DRY RUN. No database changes were made.');
    console.log('   Run without --dry-run to index images.');
  } else {
    console.log('\n✅ Indexing complete!');
  }
}

// Run the script
main().catch(console.error);

