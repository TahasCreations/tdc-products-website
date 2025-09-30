import { StorageProvider, FileUploadData, StorageUploadResult, StorageDeleteResult, StorageCopyResult, StorageMoveResult } from '../../types/media.types.js';
import { S3Client, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageAdapter implements StorageProvider {
  name = 's3';
  private s3Client: S3Client;
  private bucket: string;
  private region: string;
  private baseUrl: string;

  constructor(config: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    baseUrl?: string;
  }) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
    });
    this.bucket = config.bucket;
    this.region = config.region;
    this.baseUrl = config.baseUrl || `https://${config.bucket}.s3.${config.region}.amazonaws.com`;
  }

  async uploadFile(data: FileUploadData): Promise<StorageUploadResult> {
    try {
      const key = data.path;
      const command = new PutObjectCommand({
        Bucket: data.bucket || this.bucket,
        Key: key,
        Body: data.file,
        ContentType: data.mimeType,
        Metadata: data.metadata || {},
        ACL: data.acl || 'public-read',
      });

      const result = await this.s3Client.send(command);
      const url = `${this.baseUrl}/${key}`;

      return {
        success: true,
        url,
        path: key,
        bucket: data.bucket || this.bucket,
        etag: result.ETag,
      };
    } catch (error: any) {
      return {
        success: false,
        url: '',
        path: data.path,
        bucket: data.bucket || this.bucket,
        error: error.message,
      };
    }
  }

  async deleteFile(path: string, bucket?: string): Promise<StorageDeleteResult> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket || this.bucket,
        Key: path,
      });

      await this.s3Client.send(command);

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getFileUrl(path: string, bucket?: string): string {
    const bucketName = bucket || this.bucket;
    return `${this.baseUrl}/${path}`;
  }

  async generateSignedUrl(path: string, expiresIn: number = 3600, bucket?: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket || this.bucket,
        Key: path,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error: any) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async copyFile(sourcePath: string, destPath: string, sourceBucket?: string, destBucket?: string): Promise<StorageCopyResult> {
    try {
      const command = new CopyObjectCommand({
        Bucket: destBucket || this.bucket,
        Key: destPath,
        CopySource: `${sourceBucket || this.bucket}/${sourcePath}`,
      });

      await this.s3Client.send(command);
      const url = `${this.baseUrl}/${destPath}`;

      return {
        success: true,
        url,
        path: destPath,
      };
    } catch (error: any) {
      return {
        success: false,
        url: '',
        path: destPath,
        error: error.message,
      };
    }
  }

  async moveFile(sourcePath: string, destPath: string, sourceBucket?: string, destBucket?: string): Promise<StorageMoveResult> {
    try {
      // Copy the file
      const copyResult = await this.copyFile(sourcePath, destPath, sourceBucket, destBucket);
      
      if (!copyResult.success) {
        return {
          success: false,
          url: '',
          path: destPath,
          error: copyResult.error,
        };
      }

      // Delete the original file
      const deleteResult = await this.deleteFile(sourcePath, sourceBucket);
      
      if (!deleteResult.success) {
        return {
          success: false,
          url: '',
          path: destPath,
          error: deleteResult.error,
        };
      }

      return {
        success: true,
        url: copyResult.url,
        path: destPath,
      };
    } catch (error: any) {
      return {
        success: false,
        url: '',
        path: destPath,
        error: error.message,
      };
    }
  }

  // Additional S3-specific methods
  async listFiles(prefix: string, maxKeys: number = 1000): Promise<{
    files: Array<{
      key: string;
      size: number;
      lastModified: Date;
      etag: string;
    }>;
    hasMore: boolean;
  }> {
    try {
      const command = new (await import('@aws-sdk/client-s3')).ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await this.s3Client.send(command);
      
      return {
        files: (result.Contents || []).map(obj => ({
          key: obj.Key || '',
          size: obj.Size || 0,
          lastModified: obj.LastModified || new Date(),
          etag: obj.ETag || '',
        })),
        hasMore: result.IsTruncated || false,
      };
    } catch (error: any) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async getFileMetadata(path: string, bucket?: string): Promise<{
    size: number;
    lastModified: Date;
    etag: string;
    contentType: string;
    metadata: Record<string, string>;
  } | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket || this.bucket,
        Key: path,
      });

      const result = await this.s3Client.send(command);
      
      return {
        size: result.ContentLength || 0,
        lastModified: result.LastModified || new Date(),
        etag: result.ETag || '',
        contentType: result.ContentType || '',
        metadata: result.Metadata || {},
      };
    } catch (error: any) {
      return null;
    }
  }

  async setFileMetadata(path: string, metadata: Record<string, string>, bucket?: string): Promise<boolean> {
    try {
      // S3 doesn't support updating metadata directly, so we need to copy the object
      const copyCommand = new CopyObjectCommand({
        Bucket: bucket || this.bucket,
        Key: path,
        CopySource: `${bucket || this.bucket}/${path}`,
        Metadata: metadata,
        MetadataDirective: 'REPLACE',
      });

      await this.s3Client.send(copyCommand);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async createBucket(bucketName: string): Promise<boolean> {
    try {
      const command = new (await import('@aws-sdk/client-s3')).CreateBucketCommand({
        Bucket: bucketName,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async deleteBucket(bucketName: string): Promise<boolean> {
    try {
      const command = new (await import('@aws-sdk/client-s3')).DeleteBucketCommand({
        Bucket: bucketName,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async getBucketPolicy(bucketName: string): Promise<string | null> {
    try {
      const command = new (await import('@aws-sdk/client-s3')).GetBucketPolicyCommand({
        Bucket: bucketName,
      });

      const result = await this.s3Client.send(command);
      return result.Policy || null;
    } catch (error: any) {
      return null;
    }
  }

  async setBucketPolicy(bucketName: string, policy: string): Promise<boolean> {
    try {
      const command = new (await import('@aws-sdk/client-s3')).PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: policy,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  // Utility methods
  generatePath(storeId: string, filename: string, folder?: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const folderPath = folder ? `${folder}/` : '';
    return `stores/${storeId}/${folderPath}${timestamp}/${filename}`;
  }

  generateThumbnailPath(originalPath: string, size: string): string {
    const pathParts = originalPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    const ext = filename.split('.').pop();
    
    pathParts[pathParts.length - 1] = `${nameWithoutExt}_${size}.${ext}`;
    return pathParts.join('/');
  }

  generateWebPPath(originalPath: string): string {
    const pathParts = originalPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    
    pathParts[pathParts.length - 1] = `${nameWithoutExt}.webp`;
    return pathParts.join('/');
  }

  generateAVIFPath(originalPath: string): string {
    const pathParts = originalPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    
    pathParts[pathParts.length - 1] = `${nameWithoutExt}.avif`;
    return pathParts.join('/');
  }
}

