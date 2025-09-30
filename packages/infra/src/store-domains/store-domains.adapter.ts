import { StoreDomainsPort } from '@tdc/domain';
import { StoreDomainsService } from '@tdc/domain';
import { PrismaClient } from '@prisma/client';

export class StoreDomainsAdapter implements StoreDomainsPort {
  private service: StoreDomainsService;

  constructor(prisma: PrismaClient) {
    this.service = new StoreDomainsService(prisma);
  }

  // Store Management
  async createStore(input: any) {
    return this.service.createStore(input);
  }

  async getStore(id: string, tenantId: string) {
    return this.service.getStore(id, tenantId);
  }

  async getStoreBySlug(slug: string, tenantId: string) {
    return this.service.getStoreBySlug(slug, tenantId);
  }

  async getStores(tenantId: string, filters?: any) {
    return this.service.getStores(tenantId, filters);
  }

  async updateStore(id: string, tenantId: string, input: any) {
    return this.service.updateStore(id, tenantId, input);
  }

  async deleteStore(id: string, tenantId: string) {
    return this.service.deleteStore(id, tenantId);
  }

  // Domain Management
  async createDomain(input: any) {
    return this.service.createDomain(input);
  }

  async getDomain(id: string, tenantId: string) {
    return this.service.getDomain(id, tenantId);
  }

  async getDomainByDomain(domain: string, tenantId: string) {
    return this.service.getDomainByDomain(domain, tenantId);
  }

  async getDomains(tenantId: string, filters?: any) {
    return this.service.getDomains(tenantId, filters);
  }

  async updateDomain(id: string, tenantId: string, input: any) {
    return this.service.updateDomain(id, tenantId, input);
  }

  async deleteDomain(id: string, tenantId: string) {
    return this.service.deleteDomain(id, tenantId);
  }

  // Domain Resolution
  async resolveStoreByDomain(domain: string) {
    return this.service.resolveStoreByDomain(domain);
  }

  // Domain Verification
  async verifyDomain(id: string, tenantId: string) {
    return this.service.verifyDomain(id, tenantId);
  }

  async checkDnsRecords(domain: string) {
    return this.service.checkDnsRecords(domain);
  }

  async checkSslStatus(domain: string) {
    return this.service.checkSslStatus(domain);
  }

  // Vercel Integration
  async addDomainToVercel(domain: string, projectId: string) {
    return this.service.addDomainToVercel(domain, projectId);
  }

  async removeDomainFromVercel(domainId: string) {
    return this.service.removeDomainFromVercel(domainId);
  }

  async getVercelDomainStatus(domainId: string) {
    return this.service.getVercelDomainStatus(domainId);
  }

  // Health Checks
  async checkDomainHealth(domain: string) {
    return this.service.checkDomainHealth(domain);
  }

  async updateDomainHealth(id: string, tenantId: string, health: any) {
    return this.service.updateDomainHealth(id, tenantId, health);
  }

  // Analytics
  async getDomainStats(tenantId: string) {
    return this.service.getDomainStats(tenantId);
  }

  async getStoreStats(tenantId: string) {
    return this.service.getStoreStats(tenantId);
  }
}

