#!/usr/bin/env tsx

/**
 * Prisma Import Fixer
 * 
 * Bu script tüm API route'larındaki `new PrismaClient()` kullanımını
 * merkezi `prisma` instance'ına çevirir.
 */

import * as fs from 'fs';
import * as path from 'path';

const API_DIR = path.join(process.cwd(), 'app', 'api');

interface FixResult {
  file: string;
  fixed: boolean;
  changes: string[];
}

function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function fixPrismaImport(filePath: string): FixResult {
  const result: FixResult = {
    file: path.relative(process.cwd(), filePath),
    fixed: false,
    changes: [],
  };

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Check if file uses PrismaClient
  if (!content.includes('PrismaClient')) {
    return result;
  }

  // Check if already using the correct import
  if (content.includes("from '@/lib/prisma'") || content.includes('from "@/lib/prisma"')) {
    return result;
  }

  let hasChanges = false;

  // Remove PrismaClient import from @prisma/client if exists
  if (content.match(/import\s*{\s*PrismaClient\s*(,\s*\w+\s*)*}\s*from\s*['"]@prisma\/client['"]/)) {
    content = content.replace(
      /import\s*{\s*PrismaClient\s*(,\s*\w+\s*)*}\s*from\s*['"]@prisma\/client['"]\s*;?\s*\n/g,
      (match) => {
        // If there are other imports, keep them
        const otherImports = match.match(/PrismaClient\s*,\s*(\w+)/);
        if (otherImports) {
          result.changes.push('Kept other Prisma imports');
          return match.replace(/PrismaClient\s*,\s*/, '');
        }
        result.changes.push('Removed PrismaClient import');
        hasChanges = true;
        return '';
      }
    );
  }

  // Add prisma import from @/lib/prisma
  if (!content.includes("from '@/lib/prisma'") && !content.includes('from "@/lib/prisma"')) {
    // Find the best place to insert the import (after existing imports)
    const importMatch = content.match(/^(import[\s\S]*?from\s*['"][^'"]+['"];?\s*\n)+/m);
    if (importMatch) {
      const insertIndex = importMatch[0].length;
      content =
        content.slice(0, insertIndex) +
        "import { prisma } from '@/lib/prisma';\n" +
        content.slice(insertIndex);
      result.changes.push('Added prisma import');
      hasChanges = true;
    } else {
      // No imports found, add at the beginning after 'use server' or 'use client' if exists
      const useDirectiveMatch = content.match(/^['"]use (server|client)['"];?\s*\n/);
      if (useDirectiveMatch) {
        const insertIndex = useDirectiveMatch[0].length;
        content =
          content.slice(0, insertIndex) +
          "\nimport { prisma } from '@/lib/prisma';\n" +
          content.slice(insertIndex);
      } else {
        content = "import { prisma } from '@/lib/prisma';\n" + content;
      }
      result.changes.push('Added prisma import at beginning');
      hasChanges = true;
    }
  }

  // Remove `const prisma = new PrismaClient()` declarations
  if (content.match(/const\s+prisma\s*=\s*new\s+PrismaClient\(\s*\)/)) {
    content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\s*\)\s*;?\s*\n?/g, '');
    result.changes.push('Removed const prisma = new PrismaClient()');
    hasChanges = true;
  }

  // Remove `prisma.$disconnect()` calls
  if (content.includes('prisma.$disconnect')) {
    content = content.replace(/await\s+prisma\.\$disconnect\(\)\s*;?\s*\n?/g, '');
    result.changes.push('Removed prisma.$disconnect()');
    hasChanges = true;
  }

  // Check if content changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    result.fixed = true;
    hasChanges = true;
  }

  result.fixed = hasChanges;
  return result;
}

async function main() {
  console.log('🔧 Prisma Import Fixer');
  console.log('═══════════════════════════════════════\n');

  console.log('📁 Scanning API directory...\n');

  const files = getAllTsFiles(API_DIR);
  console.log(`Found ${files.length} TypeScript files\n`);

  const results: FixResult[] = [];
  let fixedCount = 0;

  for (const file of files) {
    const result = fixPrismaImport(file);
    if (result.changes.length > 0) {
      results.push(result);
      if (result.fixed) {
        fixedCount++;
      }
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('📊 RESULTS:\n');

  if (results.length === 0) {
    console.log('✅ No files need fixing!\n');
    return;
  }

  results.forEach((result) => {
    console.log(`📝 ${result.file}`);
    result.changes.forEach((change) => {
      console.log(`   ${result.fixed ? '✅' : 'ℹ️ '} ${change}`);
    });
    console.log('');
  });

  console.log('═══════════════════════════════════════');
  console.log(`\n🎉 Fixed ${fixedCount} files!`);
  console.log(`📄 Total files processed: ${files.length}\n`);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

