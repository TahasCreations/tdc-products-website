import { ImageProcessingOptions, ImageProcessingResult, ThumbnailConfig, ThumbnailSize, THUMBNAIL_SIZES } from '../types/media.types.js';
import sharp from 'sharp';

export class MediaProcessingService {
  private sharp: typeof sharp;

  constructor() {
    this.sharp = sharp;
  }

  async generateThumbnails(
    inputBuffer: Buffer,
    sizes: ThumbnailSize[],
    options: ImageProcessingOptions = {}
  ): Promise<ImageProcessingResult> {
    try {
      const thumbnails: Record<string, string> = {};
      const errors: string[] = [];

      for (const size of sizes) {
        try {
          const config = THUMBNAIL_SIZES[size];
          if (!config) {
            errors.push(`Unknown thumbnail size: ${size}`);
            continue;
          }

          const thumbnailBuffer = await this.processImage(inputBuffer, {
            ...options,
            width: config.width,
            height: config.height,
            quality: config.quality,
            format: config.format,
            fit: config.fit,
          });

          // Convert buffer to base64 data URL
          const mimeType = `image/${config.format}`;
          const base64 = thumbnailBuffer.toString('base64');
          const dataUrl = `data:${mimeType};base64,${base64}`;
          
          thumbnails[size] = dataUrl;
        } catch (error: any) {
          errors.push(`Failed to generate ${size} thumbnail: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        thumbnails,
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        thumbnails: {},
        error: error.message,
      };
    }
  }

  async convertToWebP(
    inputBuffer: Buffer,
    quality: number = 80
  ): Promise<ImageProcessingResult> {
    try {
      const webpBuffer = await this.sharp(inputBuffer)
        .webp({ quality })
        .toBuffer();

      const base64 = webpBuffer.toString('base64');
      const dataUrl = `data:image/webp;base64,${base64}`;

      return {
        success: true,
        thumbnails: {},
        webpUrl: dataUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        thumbnails: {},
        error: error.message,
      };
    }
  }

  async convertToAVIF(
    inputBuffer: Buffer,
    quality: number = 80
  ): Promise<ImageProcessingResult> {
    try {
      const avifBuffer = await this.sharp(inputBuffer)
        .avif({ quality })
        .toBuffer();

      const base64 = avifBuffer.toString('base64');
      const dataUrl = `data:image/avif;base64,${base64}`;

      return {
        success: true,
        thumbnails: {},
        avifUrl: dataUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        thumbnails: {},
        error: error.message,
      };
    }
  }

  async generateBlurPlaceholder(
    inputBuffer: Buffer,
    width: number = 20,
    quality: number = 20
  ): Promise<ImageProcessingResult> {
    try {
      const blurBuffer = await this.sharp(inputBuffer)
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality })
        .blur(5)
        .toBuffer();

      const base64 = blurBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      return {
        success: true,
        thumbnails: {},
        blurDataUrl: dataUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        thumbnails: {},
        error: error.message,
      };
    }
  }

  async optimizeImage(
    inputBuffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<ImageProcessingResult> {
    try {
      const optimizedBuffer = await this.processImage(inputBuffer, {
        quality: options.quality || 85,
        format: options.format || 'jpeg',
        ...options,
      });

      const base64 = optimizedBuffer.toString('base64');
      const mimeType = `image/${options.format || 'jpeg'}`;
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return {
        success: true,
        thumbnails: { optimized: dataUrl },
      };
    } catch (error: any) {
      return {
        success: false,
        thumbnails: {},
        error: error.message,
      };
    }
  }

  async getImageMetadata(inputBuffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
    hasAlpha: boolean;
    colorSpace: string;
    density: number;
    channels: number;
  }> {
    try {
      const metadata = await this.sharp(inputBuffer).metadata();
      
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: inputBuffer.length,
        hasAlpha: metadata.hasAlpha || false,
        colorSpace: metadata.space || 'srgb',
        density: metadata.density || 72,
        channels: metadata.channels || 3,
      };
    } catch (error: any) {
      throw new Error(`Failed to get image metadata: ${error.message}`);
    }
  }

  async validateImage(inputBuffer: Buffer): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const metadata = await this.getImageMetadata(inputBuffer);
      
      // Check if image is too large
      if (metadata.width > 10000 || metadata.height > 10000) {
        warnings.push('Image dimensions are very large, consider resizing');
      }

      // Check if image is too small
      if (metadata.width < 50 || metadata.height < 50) {
        warnings.push('Image dimensions are very small, may not display well');
      }

      // Check file size
      if (metadata.size > 50 * 1024 * 1024) { // 50MB
        warnings.push('Image file size is very large, consider compressing');
      }

      // Check format
      const supportedFormats = ['jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];
      if (!supportedFormats.includes(metadata.format)) {
        errors.push(`Unsupported image format: ${metadata.format}`);
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [`Invalid image file: ${error.message}`],
        warnings: [],
      };
    }
  }

  private async processImage(
    inputBuffer: Buffer,
    options: ImageProcessingOptions
  ): Promise<Buffer> {
    let pipeline = this.sharp(inputBuffer);

    // Resize if dimensions are specified
    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width, options.height, {
        fit: options.fit || 'cover',
        position: options.position || 'center',
        background: options.background || { r: 255, g: 255, b: 255, alpha: 1 },
        withoutEnlargement: true,
      });
    }

    // Apply filters
    if (options.blur && options.blur > 0) {
      pipeline = pipeline.blur(options.blur);
    }

    if (options.sharpen && options.sharpen > 0) {
      pipeline = pipeline.sharpen(options.sharpen);
    }

    // Apply color adjustments
    if (options.gamma !== undefined) {
      pipeline = pipeline.gamma(options.gamma);
    }

    if (options.brightness !== undefined) {
      pipeline = pipeline.modulate({
        brightness: options.brightness,
      });
    }

    if (options.contrast !== undefined) {
      pipeline = pipeline.modulate({
        contrast: options.contrast,
      });
    }

    if (options.saturation !== undefined) {
      pipeline = pipeline.modulate({
        saturation: options.saturation,
      });
    }

    if (options.hue !== undefined) {
      pipeline = pipeline.modulate({
        hue: options.hue,
      });
    }

    // Convert to output format
    switch (options.format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: options.quality || 85 });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: options.quality || 85 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: options.quality || 85 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: options.quality || 85 });
        break;
      default:
        pipeline = pipeline.jpeg({ quality: options.quality || 85 });
    }

    return await pipeline.toBuffer();
  }

  async createImageVariants(
    inputBuffer: Buffer,
    variants: Array<{
      name: string;
      width: number;
      height: number;
      quality: number;
      format: 'jpeg' | 'png' | 'webp' | 'avif';
    }>
  ): Promise<Record<string, Buffer>> {
    const results: Record<string, Buffer> = {};

    for (const variant of variants) {
      try {
        const variantBuffer = await this.processImage(inputBuffer, {
          width: variant.width,
          height: variant.height,
          quality: variant.quality,
          format: variant.format,
          fit: 'cover',
        });

        results[variant.name] = variantBuffer;
      } catch (error: any) {
        console.error(`Failed to create variant ${variant.name}:`, error);
      }
    }

    return results;
  }

  async generateResponsiveImages(
    inputBuffer: Buffer,
    breakpoints: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): Promise<Record<string, Buffer>> {
    const results: Record<string, Buffer> = {};

    for (const width of breakpoints) {
      try {
        const responsiveBuffer = await this.processImage(inputBuffer, {
          width,
          quality: 85,
          format: 'webp',
          fit: 'cover',
        });

        results[`w${width}`] = responsiveBuffer;
      } catch (error: any) {
        console.error(`Failed to create responsive image for width ${width}:`, error);
      }
    }

    return results;
  }

  async extractImageColors(inputBuffer: Buffer): Promise<{
    dominant: string;
    palette: string[];
    vibrant: string;
    muted: string;
  }> {
    try {
      const { data, info } = await this.sharp(inputBuffer)
        .resize(150, 150, { fit: 'cover' })
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Simple color extraction (in a real implementation, you'd use a more sophisticated algorithm)
      const colors = new Set<string>();
      const step = info.width * info.height / 1000; // Sample 1000 pixels

      for (let i = 0; i < data.length; i += step * info.channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        colors.add(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
      }

      const palette = Array.from(colors).slice(0, 8);
      const dominant = palette[0] || '#000000';
      const vibrant = palette[1] || dominant;
      const muted = palette[2] || dominant;

      return {
        dominant,
        palette,
        vibrant,
        muted,
      };
    } catch (error: any) {
      return {
        dominant: '#000000',
        palette: ['#000000'],
        vibrant: '#000000',
        muted: '#000000',
      };
    }
  }
}

