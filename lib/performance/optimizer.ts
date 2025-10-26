import sharp from 'sharp';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export class ImageOptimizer {
  /**
   * Optimize image buffer
   */
  static async optimize(buffer: Buffer, options: ImageOptimizationOptions = {}): Promise<Buffer> {
    const {
      width,
      height,
      quality = 85,
      format = 'webp',
      fit = 'inside'
    } = options;

    let transformer = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      transformer = transformer.resize(width, height, { fit });
    }

    // Convert to format
    switch (format) {
      case 'webp':
        transformer = transformer.webp({ quality });
        break;
      case 'jpeg':
        transformer = transformer.jpeg({ quality });
        break;
      case 'png':
        transformer = transformer.png({ quality });
        break;
      case 'avif':
        transformer = transformer.avif({ quality });
        break;
    }

    return transformer.toBuffer();
  }

  /**
   * Generate thumbnail
   */
  static async thumbnail(buffer: Buffer, size: number = 300): Promise<Buffer> {
    return this.optimize(buffer, {
      width: size,
      height: size,
      fit: 'cover',
      format: 'webp',
      quality: 80
    });
  }

  /**
   * Get image metadata
   */
  static async metadata(buffer: Buffer) {
    return sharp(buffer).metadata();
  }

  /**
   * Generate blur placeholder
   */
  static async blurPlaceholder(buffer: Buffer): Promise<string> {
    const { data, info } = await sharp(buffer)
      .resize(20, 20, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer({ resolveWithObject: true });

    return `data:image/webp;base64,${data.toString('base64')}`;
  }

  /**
   * Generate responsive images
   */
  static async responsiveImages(buffer: Buffer): Promise<{ width: number; buffer: Buffer }[]> {
    const sizes = [320, 640, 1024, 1920];
    const images = await Promise.all(
      sizes.map(async (width) => ({
        width,
        buffer: await this.optimize(buffer, { width, format: 'webp' })
      }))
    );

    return images;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static metrics: Map<string, number[]> = new Map();

  /**
   * Record performance metric
   */
  static record(metric: string, value: number): void {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }
    this.metrics.get(metric)!.push(value);
  }

  /**
   * Get average metric
   */
  static getAverage(metric: string): number {
    const values = this.metrics.get(metric);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get all metrics
   */
  static getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((values, metric) => {
      result[metric] = this.getAverage(metric);
    });
    return result;
  }

  /**
   * Clear metrics
   */
  static clear(): void {
    this.metrics.clear();
  }
}

