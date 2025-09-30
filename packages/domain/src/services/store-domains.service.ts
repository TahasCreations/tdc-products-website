import { StoreDomainsPort, StoreInput, StoreOutput, StoreUpdateInput, StoreDomainInput, StoreDomainOutput, StoreDomainUpdateInput, DomainVerificationResult, DomainStatus, StoreStatus } from '../ports/services/store-domains.port.js';
import { PrismaClient } from '@prisma/client';
import dns from 'dns';
import { promisify } from 'util';

const dnsResolve = promisify(dns.resolve);

export class StoreDomainsService implements StoreDomainsPort {
  constructor(private prisma: PrismaClient) {}

  // Store Management
  async createStore(input: StoreInput): Promise<StoreOutput> {
    const store = await this.prisma.store.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        logo: input.logo,
        favicon: input.favicon,
        theme: input.theme,
        settings: input.settings,
        status: input.status,
        isPublished: input.isPublished,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        metaKeywords: input.metaKeywords,
        metadata: input.metadata
      }
    });

    return this.mapStoreToOutput(store);
  }

  async getStore(id: string, tenantId: string): Promise<StoreOutput | null> {
    const store = await this.prisma.store.findFirst({
      where: { id, tenantId }
    });

    return store ? this.mapStoreToOutput(store) : null;
  }

  async getStoreBySlug(slug: string, tenantId: string): Promise<StoreOutput | null> {
    const store = await this.prisma.store.findFirst({
      where: { slug, tenantId }
    });

    return store ? this.mapStoreToOutput(store) : null;
  }

  async getStores(tenantId: string, filters?: {
    status?: StoreStatus;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<StoreOutput[]> {
    const where: any = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }

    const stores = await this.prisma.store.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    });

    return stores.map(store => this.mapStoreToOutput(store));
  }

  async updateStore(id: string, tenantId: string, input: StoreUpdateInput): Promise<StoreOutput> {
    const store = await this.prisma.store.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.slug && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.logo !== undefined && { logo: input.logo }),
        ...(input.favicon !== undefined && { favicon: input.favicon }),
        ...(input.theme !== undefined && { theme: input.theme }),
        ...(input.settings !== undefined && { settings: input.settings }),
        ...(input.status && { status: input.status }),
        ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
        ...(input.metaTitle !== undefined && { metaTitle: input.metaTitle }),
        ...(input.metaDescription !== undefined && { metaDescription: input.metaDescription }),
        ...(input.metaKeywords && { metaKeywords: input.metaKeywords }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      }
    });

    return this.mapStoreToOutput(store);
  }

  async deleteStore(id: string, tenantId: string): Promise<boolean> {
    try {
      await this.prisma.store.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Domain Management
  async createDomain(input: StoreDomainInput): Promise<StoreDomainOutput> {
    // Generate verification token if not provided
    const verificationToken = input.verificationToken || this.generateVerificationToken();

    const domain = await this.prisma.storeDomain.create({
      data: {
        tenantId: input.tenantId,
        storeId: input.storeId,
        domain: input.domain,
        isPrimary: input.isPrimary,
        verificationToken,
        vercelDomainId: input.vercelDomainId,
        vercelProjectId: input.vercelProjectId,
        vercelConfig: input.vercelConfig,
        dnsRecords: input.dnsRecords,
        sslEnabled: input.sslEnabled,
        sslCertificate: input.sslCertificate,
        sslExpiresAt: input.sslExpiresAt,
        metadata: input.metadata
      }
    });

    return this.mapDomainToOutput(domain);
  }

  async getDomain(id: string, tenantId: string): Promise<StoreDomainOutput | null> {
    const domain = await this.prisma.storeDomain.findFirst({
      where: { id, tenantId }
    });

    return domain ? this.mapDomainToOutput(domain) : null;
  }

  async getDomainByDomain(domain: string, tenantId: string): Promise<StoreDomainOutput | null> {
    const storeDomain = await this.prisma.storeDomain.findFirst({
      where: { domain, tenantId }
    });

    return storeDomain ? this.mapDomainToOutput(storeDomain) : null;
  }

  async getDomains(tenantId: string, filters?: {
    storeId?: string;
    status?: DomainStatus;
    isPrimary?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<StoreDomainOutput[]> {
    const where: any = { tenantId };

    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.isPrimary !== undefined) {
      where.isPrimary = filters.isPrimary;
    }

    const domains = await this.prisma.storeDomain.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    });

    return domains.map(domain => this.mapDomainToOutput(domain));
  }

  async updateDomain(id: string, tenantId: string, input: StoreDomainUpdateInput): Promise<StoreDomainOutput> {
    const domain = await this.prisma.storeDomain.update({
      where: { id },
      data: {
        ...(input.domain && { domain: input.domain }),
        ...(input.isPrimary !== undefined && { isPrimary: input.isPrimary }),
        ...(input.status && { status: input.status }),
        ...(input.verificationToken !== undefined && { verificationToken: input.verificationToken }),
        ...(input.vercelDomainId !== undefined && { vercelDomainId: input.vercelDomainId }),
        ...(input.vercelProjectId !== undefined && { vercelProjectId: input.vercelProjectId }),
        ...(input.vercelConfig !== undefined && { vercelConfig: input.vercelConfig }),
        ...(input.dnsRecords !== undefined && { dnsRecords: input.dnsRecords }),
        ...(input.dnsVerified !== undefined && { dnsVerified: input.dnsVerified }),
        ...(input.dnsVerifiedAt && { dnsVerifiedAt: input.dnsVerifiedAt }),
        ...(input.sslEnabled !== undefined && { sslEnabled: input.sslEnabled }),
        ...(input.sslCertificate !== undefined && { sslCertificate: input.sslCertificate }),
        ...(input.sslExpiresAt && { sslExpiresAt: input.sslExpiresAt }),
        ...(input.lastCheckedAt && { lastCheckedAt: input.lastCheckedAt }),
        ...(input.checkCount !== undefined && { checkCount: input.checkCount }),
        ...(input.errorCount !== undefined && { errorCount: input.errorCount }),
        ...(input.lastError !== undefined && { lastError: input.lastError }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      }
    });

    return this.mapDomainToOutput(domain);
  }

  async deleteDomain(id: string, tenantId: string): Promise<boolean> {
    try {
      await this.prisma.storeDomain.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Domain Resolution
  async resolveStoreByDomain(domain: string): Promise<{
    store: StoreOutput | null;
    domain: StoreDomainOutput | null;
    tenantId: string | null;
  }> {
    const storeDomain = await this.prisma.storeDomain.findFirst({
      where: { 
        domain,
        status: 'VERIFIED'
      },
      include: { store: true }
    });

    if (!storeDomain) {
      return {
        store: null,
        domain: null,
        tenantId: null
      };
    }

    return {
      store: this.mapStoreToOutput(storeDomain.store),
      domain: this.mapDomainToOutput(storeDomain),
      tenantId: storeDomain.tenantId
    };
  }

  // Domain Verification
  async verifyDomain(id: string, tenantId: string): Promise<DomainVerificationResult> {
    const domain = await this.prisma.storeDomain.findFirst({
      where: { id, tenantId }
    });

    if (!domain) {
      return {
        success: false,
        status: 'FAILED',
        message: 'Domain not found'
      };
    }

    try {
      // Update status to verifying
      await this.prisma.storeDomain.update({
        where: { id },
        data: { 
          status: 'VERIFYING',
          lastCheckedAt: new Date(),
          checkCount: domain.checkCount + 1
        }
      });

      // Check DNS records
      const dnsResult = await this.checkDnsRecords(domain.domain);
      
      // Check SSL status
      const sslResult = await this.checkSslStatus(domain.domain);

      // Check Vercel status if configured
      let vercelStatus = null;
      if (domain.vercelDomainId) {
        vercelStatus = await this.getVercelDomainStatus(domain.vercelDomainId);
      }

      // Determine overall status
      const isVerified = dnsResult.success && sslResult.enabled;
      const newStatus = isVerified ? 'VERIFIED' : 'FAILED';

      // Update domain with results
      await this.prisma.storeDomain.update({
        where: { id },
        data: {
          status: newStatus,
          dnsVerified: dnsResult.success,
          dnsVerifiedAt: dnsResult.success ? new Date() : null,
          sslEnabled: sslResult.enabled,
          sslCertificate: sslResult.certificate,
          sslExpiresAt: sslResult.expiresAt,
          lastCheckedAt: new Date(),
          errorCount: isVerified ? domain.errorCount : domain.errorCount + 1,
          lastError: isVerified ? null : 'Domain verification failed'
        }
      });

      return {
        success: isVerified,
        status: newStatus,
        message: isVerified ? 'Domain verified successfully' : 'Domain verification failed',
        dnsRecords: dnsResult.records,
        sslStatus: {
          enabled: sslResult.enabled,
          certificate: sslResult.certificate,
          expiresAt: sslResult.expiresAt,
          issuer: sslResult.issuer
        },
        vercelStatus: vercelStatus ? {
          domainId: domain.vercelDomainId,
          projectId: domain.vercelProjectId,
          status: vercelStatus.status,
          error: vercelStatus.error
        } : undefined
      };

    } catch (error) {
      // Update domain with error
      await this.prisma.storeDomain.update({
        where: { id },
        data: {
          status: 'FAILED',
          lastCheckedAt: new Date(),
          errorCount: domain.errorCount + 1,
          lastError: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      return {
        success: false,
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkDnsRecords(domain: string): Promise<{
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
  }> {
    try {
      // Check A record
      const aRecords = await dnsResolve(domain, 'A');
      
      // Check CNAME record
      let cnameRecords: string[] = [];
      try {
        cnameRecords = await dnsResolve(domain, 'CNAME');
      } catch (error) {
        // CNAME might not exist, that's okay
      }

      // Check TXT record for verification
      let txtRecords: string[] = [];
      try {
        txtRecords = await dnsResolve(domain, 'TXT');
      } catch (error) {
        // TXT might not exist, that's okay
      }

      const records = [
        ...aRecords.map(value => ({ type: 'A', name: domain, value, ttl: 300 })),
        ...cnameRecords.map(value => ({ type: 'CNAME', name: domain, value, ttl: 300 })),
        ...txtRecords.map(value => ({ type: 'TXT', name: domain, value, ttl: 300 }))
      ];

      return {
        success: aRecords.length > 0 || cnameRecords.length > 0,
        records,
        missing: []
      };

    } catch (error) {
      return {
        success: false,
        records: [],
        missing: [
          { type: 'A', name: domain, value: 'Your server IP' },
          { type: 'CNAME', name: domain, value: 'your-app.vercel.app' }
        ]
      };
    }
  }

  async checkSslStatus(domain: string): Promise<{
    enabled: boolean;
    certificate?: string;
    expiresAt?: Date;
    issuer?: string;
  }> {
    try {
      // This is a simplified SSL check
      // In production, you would use a proper SSL certificate validation library
      const https = require('https');
      
      return new Promise((resolve) => {
        const options = {
          hostname: domain,
          port: 443,
          path: '/',
          method: 'HEAD',
          rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
          const cert = res.connection.getPeerCertificate();
          resolve({
            enabled: true,
            certificate: cert.subject?.CN || '',
            expiresAt: new Date(cert.valid_to),
            issuer: cert.issuer?.CN || ''
          });
        });

        req.on('error', () => {
          resolve({
            enabled: false
          });
        });

        req.setTimeout(5000, () => {
          req.destroy();
          resolve({
            enabled: false
          });
        });

        req.end();
      });

    } catch (error) {
      return {
        enabled: false
      };
    }
  }

  // Vercel Integration
  async addDomainToVercel(domain: string, projectId: string): Promise<{
    success: boolean;
    domainId?: string;
    error?: string;
  }> {
    try {
      // This is a mock implementation
      // In production, you would use the Vercel API
      const vercelApiKey = process.env.VERCEL_API_TOKEN;
      
      if (!vercelApiKey) {
        return {
          success: false,
          error: 'Vercel API token not configured'
        };
      }

      // Mock Vercel API call
      const response = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: domain
        })
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Vercel API error: ${error}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        domainId: data.id
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async removeDomainFromVercel(domainId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const vercelApiKey = process.env.VERCEL_API_TOKEN;
      
      if (!vercelApiKey) {
        return {
          success: false,
          error: 'Vercel API token not configured'
        };
      }

      const response = await fetch(`https://api.vercel.com/v10/domains/${domainId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${vercelApiKey}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Vercel API error: ${error}`
        };
      }

      return {
        success: true
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getVercelDomainStatus(domainId: string): Promise<{
    status: string;
    error?: string;
  }> {
    try {
      const vercelApiKey = process.env.VERCEL_API_TOKEN;
      
      if (!vercelApiKey) {
        return {
          status: 'error',
          error: 'Vercel API token not configured'
        };
      }

      const response = await fetch(`https://api.vercel.com/v10/domains/${domainId}`, {
        headers: {
          'Authorization': `Bearer ${vercelApiKey}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          status: 'error',
          error: `Vercel API error: ${error}`
        };
      }

      const data = await response.json();
      return {
        status: data.status || 'unknown'
      };

    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Health Checks
  async checkDomainHealth(domain: string): Promise<{
    isOnline: boolean;
    responseTime: number;
    sslValid: boolean;
    dnsValid: boolean;
    lastChecked: Date;
  }> {
    const startTime = Date.now();
    
    try {
      // Check if domain is online
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        timeout: 5000
      });

      const responseTime = Date.now() - startTime;
      const isOnline = response.ok;

      // Check SSL validity
      const sslResult = await this.checkSslStatus(domain);
      const sslValid = sslResult.enabled;

      // Check DNS validity
      const dnsResult = await this.checkDnsRecords(domain);
      const dnsValid = dnsResult.success;

      return {
        isOnline,
        responseTime,
        sslValid,
        dnsValid,
        lastChecked: new Date()
      };

    } catch (error) {
      return {
        isOnline: false,
        responseTime: Date.now() - startTime,
        sslValid: false,
        dnsValid: false,
        lastChecked: new Date()
      };
    }
  }

  async updateDomainHealth(id: string, tenantId: string, health: {
    isOnline: boolean;
    responseTime: number;
    sslValid: boolean;
    dnsValid: boolean;
  }): Promise<void> {
    await this.prisma.storeDomain.update({
      where: { id },
      data: {
        lastCheckedAt: new Date(),
        checkCount: { increment: 1 },
        errorCount: health.isOnline ? { increment: 0 } : { increment: 1 },
        lastError: health.isOnline ? null : 'Domain health check failed',
        metadata: {
          ...health,
          lastHealthCheck: new Date().toISOString()
        }
      }
    });
  }

  // Analytics
  async getDomainStats(tenantId: string): Promise<{
    totalDomains: number;
    verifiedDomains: number;
    failedDomains: number;
    pendingDomains: number;
    sslEnabledDomains: number;
    averageResponseTime: number;
  }> {
    const [
      totalDomains,
      verifiedDomains,
      failedDomains,
      pendingDomains,
      sslEnabledDomains,
      domainsWithHealth
    ] = await Promise.all([
      this.prisma.storeDomain.count({ where: { tenantId } }),
      this.prisma.storeDomain.count({ where: { tenantId, status: 'VERIFIED' } }),
      this.prisma.storeDomain.count({ where: { tenantId, status: 'FAILED' } }),
      this.prisma.storeDomain.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.storeDomain.count({ where: { tenantId, sslEnabled: true } }),
      this.prisma.storeDomain.findMany({
        where: { 
          tenantId,
          metadata: { path: ['responseTime'], not: null }
        },
        select: { metadata: true }
      })
    ]);

    const averageResponseTime = domainsWithHealth.length > 0
      ? domainsWithHealth.reduce((sum, domain) => {
          const responseTime = domain.metadata?.responseTime || 0;
          return sum + responseTime;
        }, 0) / domainsWithHealth.length
      : 0;

    return {
      totalDomains,
      verifiedDomains,
      failedDomains,
      pendingDomains,
      sslEnabledDomains,
      averageResponseTime
    };
  }

  async getStoreStats(tenantId: string): Promise<{
    totalStores: number;
    activeStores: number;
    publishedStores: number;
    storesWithDomains: number;
    averageDomainsPerStore: number;
  }> {
    const [
      totalStores,
      activeStores,
      publishedStores,
      storesWithDomains,
      totalDomains
    ] = await Promise.all([
      this.prisma.store.count({ where: { tenantId } }),
      this.prisma.store.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.store.count({ where: { tenantId, isPublished: true } }),
      this.prisma.store.count({
        where: {
          tenantId,
          domains: { some: {} }
        }
      }),
      this.prisma.storeDomain.count({ where: { tenantId } })
    ]);

    const averageDomainsPerStore = totalStores > 0 ? totalDomains / totalStores : 0;

    return {
      totalStores,
      activeStores,
      publishedStores,
      storesWithDomains,
      averageDomainsPerStore
    };
  }

  // Private helper methods
  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private mapStoreToOutput(store: any): StoreOutput {
    return {
      id: store.id,
      tenantId: store.tenantId,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logo: store.logo,
      favicon: store.favicon,
      theme: store.theme,
      settings: store.settings,
      status: store.status,
      isPublished: store.isPublished,
      metaTitle: store.metaTitle,
      metaDescription: store.metaDescription,
      metaKeywords: store.metaKeywords,
      viewCount: store.viewCount,
      lastViewedAt: store.lastViewedAt,
      metadata: store.metadata,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt
    };
  }

  private mapDomainToOutput(domain: any): StoreDomainOutput {
    return {
      id: domain.id,
      tenantId: domain.tenantId,
      storeId: domain.storeId,
      domain: domain.domain,
      isPrimary: domain.isPrimary,
      status: domain.status,
      verificationToken: domain.verificationToken,
      vercelDomainId: domain.vercelDomainId,
      vercelProjectId: domain.vercelProjectId,
      vercelConfig: domain.vercelConfig,
      dnsRecords: domain.dnsRecords,
      dnsVerified: domain.dnsVerified,
      dnsVerifiedAt: domain.dnsVerifiedAt,
      sslEnabled: domain.sslEnabled,
      sslCertificate: domain.sslCertificate,
      sslExpiresAt: domain.sslExpiresAt,
      lastCheckedAt: domain.lastCheckedAt,
      checkCount: domain.checkCount,
      errorCount: domain.errorCount,
      lastError: domain.lastError,
      metadata: domain.metadata,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }
}

