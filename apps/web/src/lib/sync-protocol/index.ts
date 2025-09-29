import { z } from "zod";

export const EntityBase = z.object({
  id: z.string(),
  updatedAt: z.string().datetime(),
  rev: z.number().int().nonnegative(),
  updatedBy: z.enum(['cloud','local']),
  checksum: z.string(),
  deletedAt: z.string().datetime().nullable().optional()
});
export type TEntityBase = z.infer<typeof EntityBase>;

export const Product = EntityBase.extend({
  name: z.string(),
  price: z.number().nonnegative(),
  enabled: z.boolean()
});
export type TProduct = z.infer<typeof Product>;

export const Change = z.object({
  entity: z.enum(['product']), // Extend with 'category' etc. later
  op: z.enum(['upsert','delete']),
  data: Product // Use a union type if multiple entities
});
export type TChange = z.infer<typeof Change>;

export const ChangeBatch = z.object({
  clientRev: z.number().int().nonnegative(),
  changes: z.array(Change).min(1)
});
export type TChangeBatch = z.infer<typeof ChangeBatch>;

// Utility functions
export function sha256(obj: any): string {
  const str = JSON.stringify(obj);
  return Buffer.from(str).toString('base64'); // Simplified for now
}

export async function signedFetch<T>(url: string, token: string, body: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sync-token': token,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.error || response.statusText}`);
  }

  return response.json() as Promise<T>;
}