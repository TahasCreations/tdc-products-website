import { z } from 'zod';

// Store Domain Status
export const DomainStatus = z.enum([
  'PENDING',
  'VERIFYING',
  'VERIFIED',
  'FAILED',
  'SUSPENDED',
  'EXPIRED'
]);

export type DomainStatus = z.infer<typeof DomainStatus>;

// Store Status
export const StoreStatus = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'MAINTENANCE'
]);

export type StoreStatus = z.infer<typeof StoreStatus>;

// Store Domain Input
export const StoreDomainInput = z.object({
  tenantId: z.string(),
  storeId: z.string(),
  domain: z.string().min(1).max(255),
  isPrimary: z.boolean().default(false),
  verificationToken: z.string().optional(),
  vercelDomainId: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelConfig: z.record(z.any()).optional(),
  dnsRecords: z.record(z.any()).optional(),
  sslEnabled: z.boolean().default(false),
  sslCertificate: z.string().optional(),
  sslExpiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional()
});

export type StoreDomainInput = z.infer<typeof StoreDomainInput>;

// Store Domain Update
export const StoreDomainUpdateInput = z.object({
  domain: z.string().min(1).max(255).optional(),
  isPrimary: z.boolean().optional(),
  status: DomainStatus.optional(),
  verificationToken: z.string().optional(),
  vercelDomainId: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelConfig: z.record(z.any()).optional(),
  dnsRecords: z.record(z.any()).optional(),
  dnsVerified: z.boolean().optional(),
  dnsVerifiedAt: z.date().optional(),
  sslEnabled: z.boolean().optional(),
  sslCertificate: z.string().optional(),
  sslExpiresAt: z.date().optional(),
  lastCheckedAt: z.date().optional(),
  checkCount: z.number().int().min(0).optional(),
  errorCount: z.number().int().min(0).optional(),
  lastError: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type StoreDomainUpdateInput = z.infer<typeof StoreDomainUpdateInput>;

// Store Domain Output
export const StoreDomainOutput = z.object({
  id: z.string(),
  tenantId: z.string(),
  storeId: z.string(),
  domain: z.string(),
  isPrimary: z.boolean(),
  status: DomainStatus,
  verificationToken: z.string().nullable(),
  vercelDomainId: z.string().nullable(),
  vercelProjectId: z.string().nullable(),
  vercelConfig: z.record(z.any()).nullable(),
  dnsRecords: z.record(z.any()).nullable(),
  dnsVerified: z.boolean(),
  dnsVerifiedAt: z.date().nullable(),
  sslEnabled: z.boolean(),
  sslCertificate: z.string().nullable(),
  sslExpiresAt: z.date().nullable(),
  lastCheckedAt: z.date().nullable(),
  checkCount: z.number(),
  errorCount: z.number(),
  lastError: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type StoreDomainOutput = z.infer<typeof StoreDomainOutput>;

// Store Input
export const StoreInput = z.object({
  tenantId: z.string(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
  status: StoreStatus.default('ACTIVE'),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional()
});

export type StoreInput = z.infer<typeof StoreInput>;

// Store Update
export const StoreUpdateInput = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
  status: StoreStatus.optional(),
  isPublished: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

export type StoreUpdateInput = z.infer<typeof StoreUpdateInput>;

// Store Output
export const StoreOutput = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  favicon: z.string().nullable(),
  theme: z.string().nullable(),
  settings: z.record(z.any()).nullable(),
  status: StoreStatus,
  isPublished: z.boolean(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaKeywords: z.array(z.string()),
  viewCount: z.number(),
  lastViewedAt: z.date().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type StoreOutput = z.infer<typeof StoreOutput>;

// Domain Verification Result
export const DomainVerificationResult = z.object({
  success: z.boolean(),
  status: DomainStatus,
  message: z.string(),
  dnsRecords: z.array(z.object({
    type: z.string(),
    name: z.string(),
    value: z.string(),
    ttl: z.number().optional()
  })).optional(),
  sslStatus: z.object({
    enabled: z.boolean(),
    certificate: z.string().optional(),
    expiresAt: z.date().optional(),
    issuer: z.string().optional()
  }).optional(),
  vercelStatus: z.object({
    domainId: z.string().optional(),
    projectId: z.string().optional(),
    status: z.string().optional(),
    error: z.string().optional()
  }).optional()
});

export type DomainVerificationResult = z.infer<typeof DomainVerificationResult>;

// Store Domain Port Interface
export interface StoreDomainsPort {
  // Store Management
  createStore(input: StoreInput): Promise<StoreOutput>;
  getStore(id: string, tenantId: string): Promise<StoreOutput | null>;
  getStoreBySlug(slug: string, tenantId: string): Promise<StoreOutput | null>;
  getStores(tenantId: string, filters?: {
    status?: StoreStatus;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<StoreOutput[]>;
  updateStore(id: string, tenantId: string, input: StoreUpdateInput): Promise<StoreOutput>;
  deleteStore(id: string, tenantId: string): Promise<boolean>;

  // Domain Management
  createDomain(input: StoreDomainInput): Promise<StoreDomainOutput>;
  getDomain(id: string, tenantId: string): Promise<StoreDomainOutput | null>;
  getDomainByDomain(domain: string, tenantId: string): Promise<StoreDomainOutput | null>;
  getDomains(tenantId: string, filters?: {
    storeId?: string;
    status?: DomainStatus;
    isPrimary?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<StoreDomainOutput[]>;
  updateDomain(id: string, tenantId: string, input: StoreDomainUpdateInput): Promise<StoreDomainOutput>;
  deleteDomain(id: string, tenantId: string): Promise<boolean>;

  // Domain Resolution
  resolveStoreByDomain(domain: string): Promise<{
    store: StoreOutput | null;
    domain: StoreDomainOutput | null;
    tenantId: string | null;
  }>;

  // Domain Verification
  verifyDomain(id: string, tenantId: string): Promise<DomainVerificationResult>;
  checkDnsRecords(domain: string): Promise<{
    success: boolean;
    records: Array<{
      type: string;
      name: string;
      value: string;
      ttl?: number;
    }>;
    missing: Array<{
      type: string;
      name: string;
      value: string;
    }>;
  }>;
  checkSslStatus(domain: string): Promise<{
    enabled: boolean;
    certificate?: string;
    expiresAt?: Date;
    issuer?: string;
  }>;

  // Vercel Integration
  addDomainToVercel(domain: string, projectId: string): Promise<{
    success: boolean;
    domainId?: string;
    error?: string;
  }>;
  removeDomainFromVercel(domainId: string): Promise<{
    success: boolean;
    error?: string;
  }>;
  getVercelDomainStatus(domainId: string): Promise<{
    status: string;
    error?: string;
  }>;

  // Health Checks
  checkDomainHealth(domain: string): Promise<{
    isOnline: boolean;
    responseTime: number;
    sslValid: boolean;
    dnsValid: boolean;
    lastChecked: Date;
  }>;
  updateDomainHealth(id: string, tenantId: string, health: {
    isOnline: boolean;
    responseTime: number;
    sslValid: boolean;
    dnsValid: boolean;
  }): Promise<void>;

  // Analytics
  getDomainStats(tenantId: string): Promise<{
    totalDomains: number;
    verifiedDomains: number;
    failedDomains: number;
    pendingDomains: number;
    sslEnabledDomains: number;
    averageResponseTime: number;
  }>;
  getStoreStats(tenantId: string): Promise<{
    totalStores: number;
    activeStores: number;
    publishedStores: number;
    storesWithDomains: number;
    averageDomainsPerStore: number;
  }>;
}

