import { Job, JobResult } from '../job-service.js';
import { ImageProcessingJobData } from '../job-service.js';
import { S3Adapter } from '../../storage/s3.adapter.js';
import { env } from '@tdc/config';

export class ImageProcessingHandler {
  private s3Adapter: S3Adapter;

  constructor() {
    this.s3Adapter = new S3Adapter();
  }

  async process(job: Job<ImageProcessingJobData>): Promise<JobResult> {
    const { jobId, tenantId, imageUrl, imageId, operations, outputPath } = job.data;

    console.log(`🖼️ Processing image ${imageId} for tenant ${tenantId}`);

    try {
      // Download original image
      const originalImageBuffer = await this.downloadImage(imageUrl);
      console.log(`📥 Downloaded image: ${originalImageBuffer.length} bytes`);

      const processedImages: Array<{ path: string; buffer: Buffer; metadata: any }> = [];

      // Process each operation
      for (const [operation, config] of Object.entries(operations)) {
        if (!config) continue;

        console.log(`🔧 Processing operation: ${operation}`);

        let processedBuffer: Buffer;
        let metadata: any = {};

        switch (operation) {
          case 'resize':
            processedBuffer = await this.resizeImage(originalImageBuffer, config);
            metadata = { width: config.width, height: config.height, quality: config.quality };
            break;

          case 'thumbnail':
            processedBuffer = await this.createThumbnail(originalImageBuffer, config);
            metadata = { width: config.width, height: config.height, quality: config.quality };
            break;

          case 'optimize':
            processedBuffer = await this.optimizeImage(originalImageBuffer, config);
            metadata = { quality: config.quality, format: config.format };
            break;

          case 'watermark':
            processedBuffer = await this.addWatermark(originalImageBuffer, config);
            metadata = { watermark: config };
            break;

          default:
            console.log(`⚠️ Unknown operation: ${operation}`);
            continue;
        }

        // Generate output path
        const operationPath = this.generateOutputPath(outputPath, operation, config);
        
        // Upload processed image
        const uploadResult = await this.s3Adapter.putObject(processedBuffer, {
          key: operationPath,
          contentType: this.getContentType(config),
          acl: 'public-read',
        });

        processedImages.push({
          path: operationPath,
          buffer: processedBuffer,
          metadata: {
            ...metadata,
            url: uploadResult.url,
            size: processedBuffer.length,
          },
        });

        console.log(`✅ Uploaded ${operation}: ${operationPath}`);
      }

      // Generate main output path
      const mainOutputPath = this.generateMainOutputPath(outputPath, imageId);
      
      // Upload optimized main image
      const mainOptimized = await this.optimizeImage(originalImageBuffer, { quality: 85, format: 'webp' });
      const mainUploadResult = await this.s3Adapter.putObject(mainOptimized, {
        key: mainOutputPath,
        contentType: 'image/webp',
        acl: 'public-read',
      });

      console.log(`✅ Image processing completed for ${imageId}`);

      return {
        success: true,
        jobId,
        result: {
          imageId,
          originalUrl: imageUrl,
          mainUrl: mainUploadResult.url,
          processedImages: processedImages.map(img => ({
            path: img.path,
            url: img.metadata.url,
            metadata: img.metadata,
          })),
          totalOperations: Object.keys(operations).length,
          processedOperations: processedImages.length,
        },
        outputUrl: mainUploadResult.url,
        metadata: {
          tenantId,
          imageId,
          operations: Object.keys(operations),
          totalSize: processedImages.reduce((sum, img) => sum + img.buffer.length, 0),
        },
      };

    } catch (error: any) {
      console.error(`❌ Image processing failed for ${imageId}:`, error.message);
      
      return {
        success: false,
        jobId,
        error: error.message,
        metadata: {
          tenantId,
          imageId,
          operation: 'image-processing',
        },
      };
    }
  }

  private async downloadImage(url: string): Promise<Buffer> {
    // In a real implementation, you would download from the URL
    // For now, we'll simulate with a placeholder
    console.log(`📥 Downloading image from: ${url}`);
    
    // Simulate download time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock buffer (in real implementation, use fetch or axios)
    return Buffer.from('mock-image-data');
  }

  private async resizeImage(buffer: Buffer, config: any): Promise<Buffer> {
    console.log(`📏 Resizing to ${config.width}x${config.height}`);
    
    // Simulate image processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, use sharp or similar library
    // const sharp = require('sharp');
    // return await sharp(buffer)
    //   .resize(config.width, config.height, { 
    //     fit: 'cover',
    //     quality: config.quality || 80 
    //   })
    //   .toBuffer();
    
    return Buffer.from(`resized-${config.width}x${config.height}-${buffer.length}`);
  }

  private async createThumbnail(buffer: Buffer, config: any): Promise<Buffer> {
    console.log(`🖼️ Creating thumbnail ${config.width}x${config.height}`);
    
    // Simulate thumbnail creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation:
    // return await sharp(buffer)
    //   .resize(config.width, config.height, { 
    //     fit: 'cover',
    //     position: 'center' 
    //   })
    //   .jpeg({ quality: config.quality || 80 })
    //   .toBuffer();
    
    return Buffer.from(`thumbnail-${config.width}x${config.height}-${buffer.length}`);
  }

  private async optimizeImage(buffer: Buffer, config: any): Promise<Buffer> {
    console.log(`⚡ Optimizing image (quality: ${config.quality}, format: ${config.format})`);
    
    // Simulate optimization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation:
    // const sharp = require('sharp');
    // let pipeline = sharp(buffer);
    // 
    // if (config.format === 'webp') {
    //   pipeline = pipeline.webp({ quality: config.quality });
    // } else if (config.format === 'jpeg') {
    //   pipeline = pipeline.jpeg({ quality: config.quality });
    // } else if (config.format === 'png') {
    //   pipeline = pipeline.png({ quality: config.quality });
    // }
    // 
    // return await pipeline.toBuffer();
    
    return Buffer.from(`optimized-${config.format}-q${config.quality}-${buffer.length}`);
  }

  private async addWatermark(buffer: Buffer, config: any): Promise<Buffer> {
    console.log(`💧 Adding watermark`);
    
    // Simulate watermark addition
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In real implementation, use sharp to add watermark
    return Buffer.from(`watermarked-${buffer.length}`);
  }

  private generateOutputPath(basePath: string, operation: string, config: any): string {
    const timestamp = Date.now();
    const configStr = operation === 'resize' ? `${config.width}x${config.height}` :
                     operation === 'thumbnail' ? `thumb_${config.width}x${config.height}` :
                     operation === 'optimize' ? `opt_${config.quality}` :
                     operation === 'watermark' ? 'watermarked' : operation;
    
    return `${basePath}/${operation}/${configStr}_${timestamp}.webp`;
  }

  private generateMainOutputPath(basePath: string, imageId: string): string {
    const timestamp = Date.now();
    return `${basePath}/main/${imageId}_${timestamp}.webp`;
  }

  private getContentType(config: any): string {
    if (config.format === 'webp') return 'image/webp';
    if (config.format === 'jpeg') return 'image/jpeg';
    if (config.format === 'png') return 'image/png';
    return 'image/webp'; // default
  }
}
