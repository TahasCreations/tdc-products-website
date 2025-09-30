import { StorageProvider, FileUploadData, StorageUploadResult, StorageDeleteResult, StorageCopyResult, StorageMoveResult } from '../../types/media.types.js';
import { promises as fs } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export class LocalStorageAdapter implements StorageProvider {
  name = 'local';
  private basePath: string;
  private baseUrl: string;

  constructor(config: {
    basePath: string;
    baseUrl: string;
  }) {
    this.basePath = config.basePath;
    this.baseUrl = config.baseUrl;
  }

  async uploadFile(data: FileUploadData): Promise<StorageUploadResult> {
    try {
      const fullPath = join(this.basePath, data.path);
      const dir = dirname(fullPath);
      
      // Create directory if it doesn't exist
      await fs.mkdir(dir, { recursive: true });
      
      // Write file
      await fs.writeFile(fullPath, data.file);
      
      const url = `${this.baseUrl}/${data.path}`;

      return {
        success: true,
        url,
        path: data.path,
        bucket: 'local',
      };
    } catch (error: any) {
      return {
        success: false,
        url: '',
        path: data.path,
        bucket: 'local',
        error: error.message,
      };
    }
  }

  async deleteFile(path: string): Promise<StorageDeleteResult> {
    try {
      const fullPath = join(this.basePath, path);
      await fs.unlink(fullPath);
      
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

  getFileUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }

  async generateSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    // For local storage, we don't need signed URLs
    // Just return the public URL
    return this.getFileUrl(path);
  }

  async copyFile(sourcePath: string, destPath: string): Promise<StorageCopyResult> {
    try {
      const sourceFullPath = join(this.basePath, sourcePath);
      const destFullPath = join(this.basePath, destPath);
      const destDir = dirname(destFullPath);
      
      // Create destination directory if it doesn't exist
      await fs.mkdir(destDir, { recursive: true });
      
      // Copy file
      await fs.copyFile(sourceFullPath, destFullPath);
      
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

  async moveFile(sourcePath: string, destPath: string): Promise<StorageMoveResult> {
    try {
      const sourceFullPath = join(this.basePath, sourcePath);
      const destFullPath = join(this.basePath, destPath);
      const destDir = dirname(destFullPath);
      
      // Create destination directory if it doesn't exist
      await fs.mkdir(destDir, { recursive: true });
      
      // Move file
      await fs.rename(sourceFullPath, destFullPath);
      
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

  // Additional local storage methods
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
      const fullPath = join(this.basePath, prefix);
      const files: Array<{
        key: string;
        size: number;
        lastModified: Date;
        etag: string;
      }> = [];

      const listFilesRecursive = async (dir: string, relativePath: string = '') => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullEntryPath = join(dir, entry.name);
          const relativeEntryPath = join(relativePath, entry.name);
          
          if (entry.isDirectory()) {
            await listFilesRecursive(fullEntryPath, relativeEntryPath);
          } else {
            const stats = await fs.stat(fullEntryPath);
            files.push({
              key: relativeEntryPath,
              size: stats.size,
              lastModified: stats.mtime,
              etag: `"${stats.mtime.getTime()}"`,
            });
            
            if (files.length >= maxKeys) {
              break;
            }
          }
        }
      };

      await listFilesRecursive(fullPath);
      
      return {
        files: files.slice(0, maxKeys),
        hasMore: files.length >= maxKeys,
      };
    } catch (error: any) {
      return {
        files: [],
        hasMore: false,
      };
    }
  }

  async getFileMetadata(path: string): Promise<{
    size: number;
    lastModified: Date;
    etag: string;
    contentType: string;
    metadata: Record<string, string>;
  } | null> {
    try {
      const fullPath = join(this.basePath, path);
      const stats = await fs.stat(fullPath);
      
      // Simple MIME type detection based on extension
      const contentType = this.getMimeType(path);
      
      return {
        size: stats.size,
        lastModified: stats.mtime,
        etag: `"${stats.mtime.getTime()}"`,
        contentType,
        metadata: {},
      };
    } catch (error: any) {
      return null;
    }
  }

  async setFileMetadata(path: string, metadata: Record<string, string>): Promise<boolean> {
    // Local storage doesn't support metadata, so we'll store it in a separate file
    try {
      const metadataPath = join(this.basePath, path + '.meta');
      await fs.writeFile(metadataPath, JSON.stringify(metadata));
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async getFileMetadataFromFile(path: string): Promise<Record<string, string>> {
    try {
      const metadataPath = join(this.basePath, path + '.meta');
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(metadataContent);
    } catch (error: any) {
      return {};
    }
  }

  async createDirectory(path: string): Promise<boolean> {
    try {
      const fullPath = join(this.basePath, path);
      await fs.mkdir(fullPath, { recursive: true });
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async deleteDirectory(path: string): Promise<boolean> {
    try {
      const fullPath = join(this.basePath, path);
      await fs.rmdir(fullPath, { recursive: true });
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async fileExists(path: string): Promise<boolean> {
    try {
      const fullPath = join(this.basePath, path);
      await fs.access(fullPath);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async getFileSize(path: string): Promise<number> {
    try {
      const fullPath = join(this.basePath, path);
      const stats = await fs.stat(fullPath);
      return stats.size;
    } catch (error: any) {
      return 0;
    }
  }

  // Utility methods
  private getMimeType(path: string): string {
    const ext = extname(path).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.txt': 'text/plain',
      '.json': 'application/json',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }

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

  async cleanupEmptyDirectories(): Promise<number> {
    let cleanedCount = 0;
    
    const cleanupRecursive = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await cleanupRecursive(fullPath);
            
            // Check if directory is empty after recursive cleanup
            const remainingEntries = await fs.readdir(fullPath);
            if (remainingEntries.length === 0) {
              await fs.rmdir(fullPath);
              cleanedCount++;
            }
          }
        }
      } catch (error: any) {
        // Ignore errors for individual directories
      }
    };

    await cleanupRecursive(this.basePath);
    return cleanedCount;
  }

  async getStorageUsage(): Promise<{
    totalSize: number;
    fileCount: number;
    directoryCount: number;
  }> {
    let totalSize = 0;
    let fileCount = 0;
    let directoryCount = 0;
    
    const calculateRecursive = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          
          if (entry.isDirectory()) {
            directoryCount++;
            await calculateRecursive(fullPath);
          } else {
            fileCount++;
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
          }
        }
      } catch (error: any) {
        // Ignore errors for individual files/directories
      }
    };

    await calculateRecursive(this.basePath);
    
    return {
      totalSize,
      fileCount,
      directoryCount,
    };
  }
}

