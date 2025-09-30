/**
 * Email Adapter Implementation
 * Mock implementation of EmailPort for testing and development
 */

import { 
  EmailPort, 
  EmailMessage, 
  EmailResponse, 
  EmailTemplate, 
  EmailProvider 
} from '@tdc/domain';

export class MockEmailAdapter implements EmailPort {
  private templates: Map<string, EmailTemplate> = new Map();
  private providers: Map<string, EmailProvider> = new Map();
  private messages: Map<string, EmailResponse> = new Map();
  private stats = {
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalBounced: 0
  };

  constructor() {
    this.initializeDefaultProviders();
  }

  private initializeDefaultProviders() {
    // Default SMTP provider
    this.addProvider({
      name: 'Default SMTP',
      type: 'SMTP',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        username: 'noreply@example.com',
        fromEmail: 'noreply@example.com',
        fromName: 'TDC Platform'
      },
      limits: {
        dailyLimit: 1000,
        monthlyLimit: 30000,
        rateLimit: 100
      },
      isActive: true
    });

    // Default API provider
    this.addProvider({
      name: 'SendGrid API',
      type: 'API',
      config: {
        apiKey: 'mock-sendgrid-key',
        apiUrl: 'https://api.sendgrid.com/v3',
        fromEmail: 'noreply@example.com',
        fromName: 'TDC Platform'
      },
      limits: {
        dailyLimit: 2000,
        monthlyLimit: 60000,
        rateLimit: 200
      },
      isActive: true
    });
  }

  async sendEmail(message: EmailMessage): Promise<EmailResponse> {
    console.log('[Mock Email Adapter] Sending email:', {
      to: message.to,
      subject: message.subject,
      templateId: message.templateId
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const status = Math.random() > 0.05 ? 'sent' : 'failed'; // 95% success rate
    const error = status === 'failed' ? 'Simulated delivery failure' : undefined;

    const response: EmailResponse = {
      messageId,
      status: status as 'sent' | 'queued' | 'failed',
      providerId: 'mock-provider-1',
      providerResponse: {
        id: messageId,
        status: status,
        timestamp: new Date().toISOString()
      },
      error,
      metadata: {
        adapter: 'mock',
        sentAt: new Date().toISOString()
      }
    };

    this.messages.set(messageId, response);
    this.stats.totalSent++;

    if (status === 'sent') {
      // Simulate delivery after 1-3 seconds
      setTimeout(() => {
        this.simulateDelivery(messageId);
      }, 1000 + Math.random() * 2000);
    }

    return response;
  }

  async sendBulkEmails(messages: EmailMessage[]): Promise<EmailResponse[]> {
    console.log(`[Mock Email Adapter] Sending ${messages.length} bulk emails`);

    const responses: EmailResponse[] = [];
    
    // Process in batches to simulate rate limiting
    const batchSize = 10;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchPromises = batch.map(message => this.sendEmail(message));
      const batchResponses = await Promise.all(batchPromises);
      responses.push(...batchResponses);
      
      // Simulate delay between batches
      if (i + batchSize < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return responses;
  }

  private async simulateDelivery(messageId: string) {
    const message = this.messages.get(messageId);
    if (!message) return;

    // Simulate delivery
    message.status = 'sent';
    this.stats.totalDelivered++;

    // Simulate open tracking (30% of delivered emails)
    if (Math.random() < 0.3) {
      setTimeout(() => {
        this.simulateOpen(messageId);
      }, 5000 + Math.random() * 30000); // 5-35 seconds
    }
  }

  private async simulateOpen(messageId: string) {
    const message = this.messages.get(messageId);
    if (!message) return;

    this.stats.totalOpened++;
    console.log(`[Mock Email Adapter] Email ${messageId} opened`);
  }

  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newTemplate: EmailTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.templates.set(id, newTemplate);
    console.log('[Mock Email Adapter] Template created:', id);
    
    return newTemplate;
  }

  async updateTemplate(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error('Template not found');
    }

    const updated: EmailTemplate = {
      ...existing,
      ...template,
      id,
      updatedAt: new Date()
    };

    this.templates.set(id, updated);
    console.log('[Mock Email Adapter] Template updated:', id);
    
    return updated;
  }

  async getTemplate(id: string): Promise<EmailTemplate | null> {
    return this.templates.get(id) || null;
  }

  async getTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.templates.values());
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const deleted = this.templates.delete(id);
    console.log('[Mock Email Adapter] Template deleted:', id, deleted);
    return deleted;
  }

  async addProvider(provider: Omit<EmailProvider, 'id'>): Promise<EmailProvider> {
    const id = `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newProvider: EmailProvider = {
      ...provider,
      id
    };

    this.providers.set(id, newProvider);
    console.log('[Mock Email Adapter] Provider added:', id);
    
    return newProvider;
  }

  async updateProvider(id: string, provider: Partial<EmailProvider>): Promise<EmailProvider> {
    const existing = this.providers.get(id);
    if (!existing) {
      throw new Error('Provider not found');
    }

    const updated: EmailProvider = {
      ...existing,
      ...provider,
      id
    };

    this.providers.set(id, updated);
    console.log('[Mock Email Adapter] Provider updated:', id);
    
    return updated;
  }

  async getProvider(id: string): Promise<EmailProvider | null> {
    return this.providers.get(id) || null;
  }

  async getProviders(): Promise<EmailProvider[]> {
    return Array.from(this.providers.values());
  }

  async removeProvider(id: string): Promise<boolean> {
    const deleted = this.providers.delete(id);
    console.log('[Mock Email Adapter] Provider removed:', id, deleted);
    return deleted;
  }

  async getDeliveryStatus(messageId: string): Promise<{
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    error?: string;
  }> {
    const message = this.messages.get(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    return {
      status: message.status as any,
      deliveredAt: message.status === 'sent' ? new Date() : undefined,
      error: message.error
    };
  }

  async getEmailStats(dateFrom: Date, dateTo: Date): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalBounced: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    const deliveryRate = this.stats.totalSent > 0 ? (this.stats.totalDelivered / this.stats.totalSent) * 100 : 0;
    const openRate = this.stats.totalDelivered > 0 ? (this.stats.totalOpened / this.stats.totalDelivered) * 100 : 0;
    const clickRate = this.stats.totalOpened > 0 ? (this.stats.totalClicked / this.stats.totalOpened) * 100 : 0;
    const bounceRate = this.stats.totalSent > 0 ? (this.stats.totalBounced / this.stats.totalSent) * 100 : 0;

    return {
      totalSent: this.stats.totalSent,
      totalDelivered: this.stats.totalDelivered,
      totalOpened: this.stats.totalOpened,
      totalClicked: this.stats.totalClicked,
      totalBounced: this.stats.totalBounced,
      deliveryRate,
      openRate,
      clickRate,
      bounceRate
    };
  }

  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    details?: any;
  }> {
    try {
      // Simulate health check
      const isHealthy = Math.random() > 0.1; // 90% healthy
      
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'Email service is healthy' : 'Email service is experiencing issues',
        details: {
          providers: this.providers.size,
          templates: this.templates.size,
          messages: this.messages.size,
          stats: this.stats
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Email service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

