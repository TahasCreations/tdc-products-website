import { z } from 'zod';

export const MediaFilterSchema = z.object({
  format: z.string().optional(),
  status: z.enum(['ACTIVE', 'DEPRECATED', 'MISSING']).optional(),
  storage: z.enum(['LOCAL', 'GCS', 'REMOTE']).optional(),
  hasAlt: z.boolean().optional(),
  tag: z.string().optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

export const UpdateAltTextSchema = z.object({
  alt: z.string().max(500),
  title: z.string().max(200).optional()
});

export const UpdateTagsSchema = z.object({
  action: z.enum(['add', 'remove', 'set']),
  tags: z.array(z.string())
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'DEPRECATED', 'MISSING'])
});

export const ReplaceImageSchema = z.object({
  assetId: z.string(),
  newFile: z.any(), // File object
  keepOriginal: z.boolean().default(true)
});

export const OptimizeImageSchema = z.object({
  assetIds: z.array(z.string()),
  format: z.enum(['webp', 'avif']).default('webp'),
  quality: z.number().min(1).max(100).default(80)
});

export const BulkUpdateSchema = z.object({
  assetIds: z.array(z.string()),
  action: z.enum(['updateAlt', 'addTags', 'removeTags', 'updateStatus', 'optimize']),
  data: z.any()
});

export type MediaFilter = z.infer<typeof MediaFilterSchema>;
export type UpdateAltText = z.infer<typeof UpdateAltTextSchema>;
export type UpdateTags = z.infer<typeof UpdateTagsSchema>;
export type UpdateStatus = z.infer<typeof UpdateStatusSchema>;
export type ReplaceImage = z.infer<typeof ReplaceImageSchema>;
export type OptimizeImage = z.infer<typeof OptimizeImageSchema>;
export type BulkUpdate = z.infer<typeof BulkUpdateSchema>;

