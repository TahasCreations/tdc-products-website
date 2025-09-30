import { NextRequest, NextResponse } from 'next/server';
import { container } from '@tdc/infra';
import { UploadOptions } from '@tdc/domain';
import { z } from 'zod';

// Validation schema
const UploadRequestSchema = z.object({
  bucket: z.string().default('tdc-market'),
  key: z.string().min(1),
  contentType: z.string().default('application/octet-stream'),
  acl: z.enum(['private', 'public-read', 'public-read-write']).default('private'),
  metadata: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Parse metadata
    const parsedMetadata = metadata ? JSON.parse(metadata) : {};
    
    // Validate request
    const validatedData = UploadRequestSchema.parse({
      ...parsedMetadata,
      contentType: file.type,
    });
    
    // Get storage service from DI container
    const storageService = container.getStorageService();
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Prepare upload options
    const uploadOptions: UploadOptions = {
      bucket: validatedData.bucket,
      key: validatedData.key,
      contentType: file.type || validatedData.contentType,
      acl: validatedData.acl,
      metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        ...validatedData.metadata,
      },
    };

    // Upload file
    const result = await storageService.putObject(buffer, uploadOptions);

    return NextResponse.json({
      success: result.success,
      data: {
        key: result.key,
        url: result.url,
        etag: result.etag,
        versionId: result.versionId,
      },
    });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'File upload failed',
      },
      { status: 400 }
    );
  }
}


