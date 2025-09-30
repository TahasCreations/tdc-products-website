import { VercelDomainConfig, VercelDomainResponse, VercelProjectResponse } from '../types/vercel.types.js';

export class VercelDomainService {
  private apiKey: string;
  private baseUrl: string = 'https://api.vercel.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vercel API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  // Get all projects
  async getProjects(): Promise<VercelProjectResponse[]> {
    return this.makeRequest('/v9/projects');
  }

  // Get project by ID
  async getProject(projectId: string): Promise<VercelProjectResponse> {
    return this.makeRequest(`/v9/projects/${projectId}`);
  }

  // Add domain to project
  async addDomain(projectId: string, domain: string): Promise<VercelDomainResponse> {
    return this.makeRequest(`/v10/projects/${projectId}/domains`, {
      method: 'POST',
      body: JSON.stringify({
        name: domain,
      }),
    });
  }

  // Remove domain from project
  async removeDomain(projectId: string, domain: string): Promise<void> {
    return this.makeRequest(`/v10/projects/${projectId}/domains/${domain}`, {
      method: 'DELETE',
    });
  }

  // Get domain configuration
  async getDomainConfig(projectId: string, domain: string): Promise<VercelDomainResponse> {
    return this.makeRequest(`/v10/projects/${projectId}/domains/${domain}`);
  }

  // Update domain configuration
  async updateDomainConfig(projectId: string, domain: string, config: VercelDomainConfig): Promise<VercelDomainResponse> {
    return this.makeRequest(`/v10/projects/${projectId}/domains/${domain}`, {
      method: 'PATCH',
      body: JSON.stringify(config),
    });
  }

  // Get domain status
  async getDomainStatus(projectId: string, domain: string): Promise<{
    status: string;
    configured: boolean;
    verified: boolean;
    error?: string;
  }> {
    try {
      const domainConfig = await this.getDomainConfig(projectId, domain);
      
      return {
        status: domainConfig.status || 'unknown',
        configured: domainConfig.configured || false,
        verified: domainConfig.verified || false,
        error: domainConfig.error
      };
    } catch (error) {
      return {
        status: 'error',
        configured: false,
        verified: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Verify domain ownership
  async verifyDomain(projectId: string, domain: string): Promise<{
    success: boolean;
    message: string;
    dnsRecords?: Array<{
      type: string;
      name: string;
      value: string;
    }>;
  }> {
    try {
      const domainConfig = await this.getDomainConfig(projectId, domain);
      
      if (domainConfig.verified) {
        return {
          success: true,
          message: 'Domain is already verified'
        };
      }

      // Get DNS records needed for verification
      const dnsRecords = await this.getDnsRecords(projectId, domain);
      
      return {
        success: false,
        message: 'Domain verification required. Please configure the following DNS records:',
        dnsRecords: dnsRecords
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify domain'
      };
    }
  }

  // Get DNS records for domain verification
  async getDnsRecords(projectId: string, domain: string): Promise<Array<{
    type: string;
    name: string;
    value: string;
  }>> {
    try {
      const domainConfig = await this.getDomainConfig(projectId, domain);
      
      // This is a simplified version - in reality, Vercel provides specific DNS records
      return [
        {
          type: 'A',
          name: domain,
          value: '76.76.19.61' // Vercel's IP address
        },
        {
          type: 'CNAME',
          name: `www.${domain}`,
          value: 'cname.vercel-dns.com'
        }
      ];
    } catch (error) {
      return [];
    }
  }

  // Check if domain is accessible
  async checkDomainAccessibility(domain: string): Promise<{
    accessible: boolean;
    responseTime: number;
    statusCode: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        timeout: 10000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        accessible: response.ok,
        responseTime,
        statusCode: response.status
      };
    } catch (error) {
      return {
        accessible: false,
        responseTime: Date.now() - startTime,
        statusCode: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get domain analytics (if available)
  async getDomainAnalytics(projectId: string, domain: string, period: string = '30d'): Promise<{
    views: number;
    visitors: number;
    bandwidth: number;
    period: string;
  }> {
    try {
      // This would require Vercel Analytics API
      // For now, return mock data
      return {
        views: 0,
        visitors: 0,
        bandwidth: 0,
        period
      };
    } catch (error) {
      throw new Error(`Failed to get domain analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // List all domains for a project
  async listDomains(projectId: string): Promise<VercelDomainResponse[]> {
    return this.makeRequest(`/v10/projects/${projectId}/domains`);
  }

  // Check domain availability
  async checkDomainAvailability(domain: string): Promise<{
    available: boolean;
    price?: number;
    currency?: string;
  }> {
    try {
      // This would require Vercel Domains API
      // For now, return mock data
      return {
        available: true,
        price: 0,
        currency: 'USD'
      };
    } catch (error) {
      return {
        available: false
      };
    }
  }
}

