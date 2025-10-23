import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export interface OptimizeOptions {
  format: 'webp' | 'avif';
  quality: number;
  keepOriginal: boolean;
}

export interface OptimizeResult {
  success: boolean;
  originalPath: string;
  optimizedPath?: string;
  originalSize: number;
  optimizedSize?: number;
  savingsPercent?: number;
  error?: string;
}

export async function optimizeImage(
  sourcePath: string,
  options: OptimizeOptions
): Promise<OptimizeResult> {
  try {
    if (!fs.existsSync(sourcePath)) {
      return {
        success: false,
        originalPath: sourcePath,
        originalSize: 0,
        error: 'Source file not found'
      };
    }

    const stats = fs.statSync(sourcePath);
    const originalSize = stats.size;

    // Parse path
    const parsed = path.parse(sourcePath);
    const derivedDir = path.join(parsed.dir, 'derived');
    
    // Ensure derived directory exists
    if (!fs.existsSync(derivedDir)) {
      fs.mkdirSync(derivedDir, { recursive: true });
    }

    const optimizedPath = path.join(
      derivedDir,
      `${parsed.name}.${options.format}`
    );

    // Process image
    let pipeline = sharp(sourcePath);

    if (options.format === 'webp') {
      pipeline = pipeline.webp({ quality: options.quality });
    } else if (options.format === 'avif') {
      pipeline = pipeline.avif({ quality: options.quality });
    }

    await pipeline.toFile(optimizedPath);

    const optimizedStats = fs.statSync(optimizedPath);
    const optimizedSize = optimizedStats.size;
    const savingsPercent = ((originalSize - optimizedSize) / originalSize) * 100;

    return {
      success: true,
      originalPath: sourcePath,
      optimizedPath,
      originalSize,
      optimizedSize,
      savingsPercent: Math.round(savingsPercent * 100) / 100
    };

  } catch (error) {
    return {
      success: false,
      originalPath: sourcePath,
      originalSize: 0,
      error: error.message
    };
  }
}

export async function batchOptimize(
  sourcePaths: string[],
  options: OptimizeOptions,
  progressCallback?: (current: number, total: number) => void
): Promise<OptimizeResult[]> {
  const results: OptimizeResult[] = [];

  for (let i = 0; i < sourcePaths.length; i++) {
    const result = await optimizeImage(sourcePaths[i], options);
    results.push(result);
    
    if (progressCallback) {
      progressCallback(i + 1, sourcePaths.length);
    }
  }

  return results;
}

export function getImageDimensions(filePath: string): Promise<{ width: number; height: number } | null> {
  return sharp(filePath)
    .metadata()
    .then(metadata => {
      if (metadata.width && metadata.height) {
        return { width: metadata.width, height: metadata.height };
      }
      return null;
    })
    .catch(() => null);
}

