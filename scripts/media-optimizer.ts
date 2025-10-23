#!/usr/bin/env tsx
/**
 * Media Optimizer Script
 * Batch optimize images for better performance
 * 
 * Usage:
 *   pnpm media:optimize
 */

import { PrismaClient } from '@prisma/client';
import { optimizeImage } from '../lib/media/optimizer';
import * as path from 'path';

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function main() {
  console.log('🎨 Media Optimizer Starting...\n');

  // Check if optimization is enabled
  if (process.env.ENABLE_IMAGE_OPTIMIZATION !== 'true') {
    console.error('❌ Image optimization is not enabled.');
    console.error('   Set ENABLE_IMAGE_OPTIMIZATION=true in your .env file\n');
    process.exit(1);
  }

  try {
    // Get all LOCAL images that are ACTIVE
    const assets = await prisma.mediaAsset.findMany({
      where: {
        storage: 'LOCAL',
        status: 'ACTIVE'
      },
      select: {
        id: true,
        url: true,
        path: true,
        filename: true,
        format: true
      }
    });

    console.log(`Found ${assets.length} local images\n`);

    if (assets.length === 0) {
      console.log('No images to optimize');
      return;
    }

    const results = {
      total: assets.length,
      optimized: 0,
      skipped: 0,
      failed: 0,
      totalSaved: 0
    };

    for (const asset of assets) {
      // Skip already optimized formats
      if (asset.format === 'webp' || asset.format === 'avif') {
        results.skipped++;
        continue;
      }

      // Skip SVG
      if (asset.format === 'svg') {
        results.skipped++;
        continue;
      }

      const sourcePath = path.join(PUBLIC_DIR, asset.path || asset.url);
      
      console.log(`Optimizing: ${asset.filename}...`);

      const result = await optimizeImage(sourcePath, {
        format: 'webp',
        quality: 80,
        keepOriginal: true
      });

      if (result.success) {
        results.optimized++;
        if (result.savingsPercent) {
          results.totalSaved += result.savingsPercent;
          console.log(`  ✓ Saved ${result.savingsPercent.toFixed(1)}% (${formatBytes(result.originalSize!)} → ${formatBytes(result.optimizedSize!)})`);
        }

        // Create history record
        await prisma.mediaHistory.create({
          data: {
            assetId: asset.id,
            action: 'optimize',
            performedBy: 'script',
            metadata: {
              format: 'webp',
              quality: 80,
              originalSize: result.originalSize,
              optimizedSize: result.optimizedSize,
              savingsPercent: result.savingsPercent
            }
          }
        });
      } else {
        results.failed++;
        console.log(`  ✗ Failed: ${result.error}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 OPTIMIZATION REPORT');
    console.log('='.repeat(60));
    console.log(`Total images:        ${results.total}`);
    console.log(`Optimized:           ${results.optimized} ✨`);
    console.log(`Skipped:             ${results.skipped} ⏭️`);
    console.log(`Failed:              ${results.failed} ❌`);
    if (results.optimized > 0) {
      console.log(`Average savings:     ${(results.totalSaved / results.optimized).toFixed(1)}% 💾`);
    }
    console.log('='.repeat(60));
    console.log('\n✅ Optimization complete!');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

main().catch(console.error);

