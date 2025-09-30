// Storage Domain Port
export interface StorageObject {
  key: string;
  bucket: string;
  contentType: string;
  size: number;
  lastModified: Date;
  metadata?: Record<string, string>;
}

export interface UploadOptions {
  bucket: string;
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read' | 'public-read-write';
}

export interface SignedUrlOptions {
  bucket: string;
  key: string;
  expiresIn?: number; // seconds
  operation?: 'getObject' | 'putObject' | 'deleteObject';
}

export interface PutObjectResult {
  success: boolean;
  key: string;
  url: string;
  etag?: string;
  versionId?: string;
}

export interface GetSignedUrlResult {
  success: boolean;
  url: string;
  expiresAt: Date;
}

export interface DeleteObjectResult {
  success: boolean;
  key: string;
}

// Storage Port Interface
export interface StoragePort {
  // Upload object
  putObject(
    buffer: Buffer, 
    options: UploadOptions
  ): Promise<PutObjectResult>;
  
  // Get signed URL
  getSignedUrl(options: SignedUrlOptions): Promise<GetSignedUrlResult>;
  
  // Delete object
  deleteObject(bucket: string, key: string): Promise<DeleteObjectResult>;
  
  // Get object metadata
  getObjectMetadata(bucket: string, key: string): Promise<StorageObject | null>;
  
  // List objects
  listObjects(
    bucket: string, 
    prefix?: string, 
    maxKeys?: number
  ): Promise<StorageObject[]>;
  
  // Copy object
  copyObject(
    sourceBucket: string,
    sourceKey: string,
    destBucket: string,
    destKey: string
  ): Promise<PutObjectResult>;
}



