import { z } from 'zod'

// Base entity schema
export const EntityBase = z.object({
  id: z.string(),
  updatedAt: z.string().datetime(),
  rev: z.number().int().nonnegative(),
  updatedBy: z.enum(['cloud', 'local']),
  checksum: z.string(),
  deletedAt: z.string().datetime().nullable().optional()
})

export type TEntityBase = z.infer<typeof EntityBase>

// Product schema
export const Product = EntityBase.extend({
  name: z.string(),
  price: z.number().nonnegative(),
  enabled: z.boolean(),
  description: z.string().optional(),
  categoryId: z.string().optional()
})

export type TProduct = z.infer<typeof Product>

// Category schema
export const Category = EntityBase.extend({
  name: z.string(),
  slug: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
  parentId: z.string().optional()
})

export type TCategory = z.infer<typeof Category>

// Change operation schema
export const Change = z.object({
  entity: z.enum(['product', 'category']),
  op: z.enum(['upsert', 'delete']),
  data: z.union([Product, Category])
})

export type TChange = z.infer<typeof Change>

// Change batch schema
export const ChangeBatch = z.object({
  clientRev: z.number().int().nonnegative(),
  changes: z.array(Change).min(1),
  clientId: z.string().optional()
})

export type TChangeBatch = z.infer<typeof ChangeBatch>

// Sync pull response
export const SyncPullResponse = z.object({
  sinceRev: z.number().int().nonnegative(),
  latestRev: z.number().int().nonnegative(),
  changes: z.array(Change),
  hasMore: z.boolean().default(false)
})

export type TSyncPullResponse = z.infer<typeof SyncPullResponse>

// Sync push response
export const SyncPushResponse = z.object({
  success: z.boolean(),
  conflicts: z.array(z.object({
    entity: z.string(),
    id: z.string(),
    currentRev: z.number(),
    incomingRev: z.number(),
    decided: z.enum(['current', 'incoming'])
  })).optional(),
  appliedCount: z.number().int().nonnegative(),
  latestRev: z.number().int().nonnegative()
})

export type TSyncPushResponse = z.infer<typeof SyncPushResponse>

// Revision log for conflict tracking
export const RevisionLog = z.object({
  id: z.string(),
  entity: z.string(),
  entityId: z.string(),
  cloudRev: z.number().int().nonnegative(),
  localRev: z.number().int().nonnegative(),
  decided: z.enum(['cloud', 'local']),
  cloudData: z.record(z.any()).optional(),
  localData: z.record(z.any()).optional(),
  at: z.string().datetime()
})

export type TRevisionLog = z.infer<typeof RevisionLog>

// Realtime event schema
export const RealtimeEvent = z.object({
  type: z.string(),
  entity: z.string(),
  entityId: z.string(),
  data: z.record(z.any()).optional(),
  timestamp: z.string().datetime()
})

export type TRealtimeEvent = z.infer<typeof RealtimeEvent>

// Export all schemas and types
export * from './hash'
export * from './http'
export * from './conflict'
