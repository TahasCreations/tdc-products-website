import { 
  StoragePort, 
  StorageObject, 
  UploadOptions, 
  SignedUrlOptions, 
  PutObjectResult, 
  GetSignedUrlResult, 
  DeleteObjectResult 
} from '@tdc/domain';
import { env } from '@tdc/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Adapter implements StoragePort {
  private readonly s3Client: S3Client;
  private readonly defaultBucket: string;

  constructor() {
    const s3Config = env.getS3Config();
    
    this.s3Client = new S3Client({
      region: 'us-east-1', // Default region
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      endpoint: s3Config.endpoint,
      forcePathStyle: true, // For S3-compatible services
    });
    
    this.defaultBucket = s3Config.bucket;
  }

  async putObject(buffer: Buffer, options: UploadOptions): Promise<PutObjectResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: options.bucket,
        Key: options.key,
        Body: buffer,
        ContentType: options.contentType,
        Metadata: options.metadata,
        ACL: options.acl,
      });

      const result = await this.s3Client.send(command);
      
      return {
        success: true,
        key: options.key,
        url: this.getObjectUrl(options.bucket, options.key),
        etag: result.ETag,
        versionId: result.VersionId,
      };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSignedUrl(options: SignedUrlOptions): Promise<GetSignedUrlResult> {
    try {
      const expiresIn = options.expiresIn || 3600; // 1 hour default
      
      let command;
      switch (options.operation || 'getObject') {
        case 'getObject':
          command = new GetObjectCommand({
            Bucket: options.bucket,
            Key: options.key,
          });
          break;
        case 'putObject':
          command = new PutObjectCommand({
            Bucket: options.bucket,
            Key: options.key,
          });
          break;
        case 'deleteObject':
          command = new DeleteObjectCommand({
            Bucket: options.bucket,
            Key: options.key,
          });
          break;
        default:
          throw new Error('Invalid operation');
      }

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      
      return {
        success: true,
        url,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      };
    } catch (error) {
      throw new Error(`S3 signed URL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteObject(bucket: string, key: string): Promise<DeleteObjectResult> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      
      return {
        success: true,
        key,
      };
    } catch (error) {
      throw new Error(`S3 delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getObjectMetadata(bucket: string, key: string): Promise<StorageObject | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const result = await this.s3Client.send(command);
      
      return {
        key,
        bucket,
        contentType: result.ContentType || 'application/octet-stream',
        size: result.ContentLength || 0,
        lastModified: result.LastModified || new Date(),
        metadata: result.Metadata,
      };
    } catch (error) {
      return null;
    }
  }

  async listObjects(bucket: string, prefix?: string, maxKeys?: number): Promise<StorageObject[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: maxKeys || 1000,
      });

      const result = await this.s3Client.send(command);
      
      return (result.Contents || []).map(obj => ({
        key: obj.Key || '',
        bucket,
        contentType: 'application/octet-stream', // S3 doesn't return content type in list
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
        metadata: {},
      }));
    } catch (error) {
      throw new Error(`S3 list objects failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async copyObject(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<PutObjectResult> {
    try {
      const command = new CopyObjectCommand({
        Bucket: destBucket,
        Key: destKey,
        CopySource: `${sourceBucket}/${sourceKey}`,
      });

      const result = await this.s3Client.send(command);
      
      return {
        success: true,
        key: destKey,
        url: this.getObjectUrl(destBucket, destKey),
        etag: result.CopyObjectResult?.ETag,
        versionId: result.VersionId,
      };
    } catch (error) {
      throw new Error(`S3 copy failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getObjectUrl(bucket: string, key: string): string {
    // This would be the actual URL format for your S3-compatible service
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
