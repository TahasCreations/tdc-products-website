import fs from 'fs';
import path from 'path';

export interface ExistingPage {
  id: string;
  name: string;
  slug: string;
  filePath: string;
  type: 'static' | 'dynamic' | 'api';
  isEditable: boolean;
  lastModified: Date;
  size: number;
}

/**
 * Scan file system for existing Next.js pages
 */
export async function scanExistingPages(): Promise<ExistingPage[]> {
  const pages: ExistingPage[] = [];
  const appDir = path.join(process.cwd(), 'app');

  // Recursive function to scan directories
  const scanDirectory = (dir: string, basePath: string = ''): void => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          // Skip certain directories
          if (['node_modules', '.next', 'api'].includes(entry.name)) continue;
          
          scanDirectory(fullPath, relativePath);
        } else if (entry.isFile() && entry.name === 'page.tsx') {
          // Found a page
          const stats = fs.statSync(fullPath);
          const slug = basePath.replace(/\\/g, '/') || '/';
          
          // Determine if page is editable in visual builder
          const content = fs.readFileSync(fullPath, 'utf-8');
          const isEditable = !content.includes('use server') && 
                            !content.includes('generateStaticParams') &&
                            !slug.startsWith('api/');

          pages.push({
            id: `existing_${slug.replace(/\//g, '_')}`,
            name: slug === '/' ? 'Ana Sayfa' : slug.split('/').pop() || slug,
            slug: slug,
            filePath: fullPath,
            type: 'static',
            isEditable,
            lastModified: stats.mtime,
            size: stats.size,
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  };

  scanDirectory(appDir);

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Get page categories from file structure
 */
export function categorizePage(slug: string): string {
  if (slug === '/') return 'main';
  if (slug.startsWith('/admin')) return 'admin';
  if (slug.startsWith('/seller')) return 'seller';
  if (slug.startsWith('/influencer')) return 'influencer';
  if (slug.startsWith('/auth')) return 'auth';
  if (slug.startsWith('/partner')) return 'partner';
  if (slug.includes('product')) return 'products';
  if (slug.includes('blog')) return 'blog';
  return 'other';
}

/**
 * Extract metadata from page file
 */
export function extractPageMetadata(filePath: string): {
  title?: string;
  description?: string;
  hasMetadata: boolean;
} {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for metadata export
    const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*{([^}]+)}/s);
    
    if (metadataMatch) {
      const metadataContent = metadataMatch[1];
      const titleMatch = metadataContent.match(/title:\s*['"]([^'"]+)['"]/);
      const descMatch = metadataContent.match(/description:\s*['"]([^'"]+)['"]/);
      
      return {
        title: titleMatch ? titleMatch[1] : undefined,
        description: descMatch ? descMatch[1] : undefined,
        hasMetadata: true,
      };
    }

    return { hasMetadata: false };
  } catch (error) {
    return { hasMetadata: false };
  }
}

