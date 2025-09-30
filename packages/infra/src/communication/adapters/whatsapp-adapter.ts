/**
 * WhatsApp Adapter Implementation
 * Mock implementation of WhatsAppPort for testing and development
 */

import { 
  WhatsAppPort, 
  WhatsAppMessage, 
  WhatsAppResponse, 
  WhatsAppTemplate, 
  WhatsAppProvider,
  WhatsAppWebhookEvent 
} from '@tdc/domain';

export class MockWhatsAppAdapter implements WhatsAppPort {
  private templates: Map<string, WhatsAppTemplate> = new Map();
  private providers: Map<string, WhatsAppProvider> = new Map();
  private messages: Map<string, WhatsAppResponse> = new Map();
  private media: Map<string, { url: string; contentType: string; filename: string }> = new Map();
  private stats = {
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalFailed: 0
  };

  constructor() {
    this.initializeDefaultProviders();
    this.initializeDefaultTemplates();
  }

  private initializeDefaultProviders() {
    // Default WhatsApp Business API provider
    this.addProvider({
      name: 'WhatsApp Business API',
      type: 'WHATSAPP_BUSINESS_API',
      config: {
        accessToken: 'mock-access-token',
        phoneNumberId: 'mock-phone-number-id',
        businessAccountId: 'mock-business-account-id',
        webhookUrl: 'https://api.example.com/webhooks/whatsapp',
        apiUrl: 'https://graph.facebook.com/v17.0',
        apiVersion: 'v17.0'
      },
      limits: {
        dailyLimit: 1000,
        monthlyLimit: 30000,
        rateLimit: 80,
        templateLimit: 250
      },
      isActive: true
    });

    // Default WhatsApp Cloud API provider
    this.addProvider({
      name: 'WhatsApp Cloud API',
      type: 'WHATSAPP_CLOUD_API',
      config: {
        accessToken: 'mock-cloud-access-token',
        phoneNumberId: 'mock-cloud-phone-number-id',
        businessAccountId: 'mock-cloud-business-account-id',
        apiUrl: 'https://graph.facebook.com/v17.0',
        apiVersion: 'v17.0'
      },
      limits: {
        dailyLimit: 2000,
        monthlyLimit: 60000,
        rateLimit: 100,
        templateLimit: 500
      },
      isActive: true
    });
  }

  private initializeDefaultTemplates() {
    // Welcome template
    this.createTemplate({
      name: 'welcome_message',
      category: 'UTILITY',
      language: 'en',
      status: 'APPROVED',
      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'Welcome to {{business_name}}!'
        },
        {
          type: 'BODY',
          format: 'TEXT',
          text: 'Hello {{customer_name}}, welcome to our store! We\'re excited to have you as a customer. Use code {{welcome_code}} for 10% off your first order.',
          example: {
            body_text: [['John', 'WELCOME10']]
          }
        },
        {
          type: 'FOOTER',
          format: 'TEXT',
          text: 'Thank you for choosing us!'
        }
      ],
      isActive: true
    });

    // Order confirmation template
    this.createTemplate({
      name: 'order_confirmation',
      category: 'UTILITY',
      language: 'en',
      status: 'APPROVED',
      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'Order Confirmation #{{order_number}}'
        },
        {
          type: 'BODY',
          format: 'TEXT',
          text: 'Hi {{customer_name}}, your order has been confirmed! Total: {{order_total}} Expected delivery: {{delivery_date}}',
          example: {
            body_text: [['John', 'ORD-12345', '$99.99', '2024-01-15']]
          }
        }
      ],
      isActive: true
    });
  }

  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    console.log('[Mock WhatsApp Adapter] Sending message:', {
      to: message.to,
      messageType: message.messageType,
      templateId: message.templateId
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    const messageId = `whatsapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const status = Math.random() > 0.03 ? 'sent' : 'failed'; // 97% success rate
    const error = status === 'failed' ? 'Simulated delivery failure' : undefined;

    const response: WhatsAppResponse = {
      messageId,
      status: status as 'sent' | 'queued' | 'failed' | 'delivered' | 'read',
      providerId: 'mock-whatsapp-provider-1',
      providerResponse: {
        id: messageId,
        status: status,
        timestamp: new Date().toISOString(),
        recipient: message.to
      },
      error,
      metadata: {
        adapter: 'mock',
        sentAt: new Date().toISOString(),
        messageType: message.messageType
      }
    };

    this.messages.set(messageId, response);
    this.stats.totalSent++;

    if (status === 'sent') {
      // Simulate delivery after 1-2 seconds
      setTimeout(() => {
        this.simulateDelivery(messageId);
      }, 1000 + Math.random() * 1000);
    }

    return response;
  }

  async sendBulkMessages(messages: WhatsAppMessage[]): Promise<WhatsAppResponse[]> {
    console.log(`[Mock WhatsApp Adapter] Sending ${messages.length} bulk messages`);

    const responses: WhatsAppResponse[] = [];
    
    // Process in batches to simulate rate limiting
    const batchSize = 5; // WhatsApp has stricter rate limits
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchPromises = batch.map(message => this.sendMessage(message));
      const batchResponses = await Promise.all(batchPromises);
      responses.push(...batchResponses);
      
      // Simulate delay between batches
      if (i + batchSize < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    return responses;
  }

  private async simulateDelivery(messageId: string) {
    const message = this.messages.get(messageId);
    if (!message) return;

    // Simulate delivery
    message.status = 'delivered';
    this.stats.totalDelivered++;

    // Simulate read tracking (70% of delivered messages)
    if (Math.random() < 0.7) {
      setTimeout(() => {
        this.simulateRead(messageId);
      }, 2000 + Math.random() * 10000); // 2-12 seconds
    }
  }

  private async simulateRead(messageId: string) {
    const message = this.messages.get(messageId);
    if (!message) return;

    message.status = 'read';
    this.stats.totalRead++;
    console.log(`[Mock WhatsApp Adapter] Message ${messageId} read`);
  }

  async createTemplate(template: Omit<WhatsAppTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WhatsAppTemplate> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newTemplate: WhatsAppTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.templates.set(id, newTemplate);
    console.log('[Mock WhatsApp Adapter] Template created:', id);
    
    return newTemplate;
  }

  async updateTemplate(id: string, template: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error('Template not found');
    }

    const updated: WhatsAppTemplate = {
      ...existing,
      ...template,
      id,
      updatedAt: new Date()
    };

    this.templates.set(id, updated);
    console.log('[Mock WhatsApp Adapter] Template updated:', id);
    
    return updated;
  }

  async getTemplate(id: string): Promise<WhatsAppTemplate | null> {
    return this.templates.get(id) || null;
  }

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    return Array.from(this.templates.values());
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const deleted = this.templates.delete(id);
    console.log('[Mock WhatsApp Adapter] Template deleted:', id, deleted);
    return deleted;
  }

  async submitTemplateForApproval(templateId: string): Promise<{ status: string; message: string }> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Simulate approval process
    template.status = 'PENDING';
    
    // Simulate approval after 5-10 seconds
    setTimeout(() => {
      const approved = Math.random() > 0.1; // 90% approval rate
      template.status = approved ? 'APPROVED' : 'REJECTED';
      console.log(`[Mock WhatsApp Adapter] Template ${templateId} ${approved ? 'approved' : 'rejected'}`);
    }, 5000 + Math.random() * 5000);

    return {
      status: 'submitted',
      message: 'Template submitted for approval'
    };
  }

  async addProvider(provider: Omit<WhatsAppProvider, 'id'>): Promise<WhatsAppProvider> {
    const id = `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newProvider: WhatsAppProvider = {
      ...provider,
      id
    };

    this.providers.set(id, newProvider);
    console.log('[Mock WhatsApp Adapter] Provider added:', id);
    
    return newProvider;
  }

  async updateProvider(id: string, provider: Partial<WhatsAppProvider>): Promise<WhatsAppProvider> {
    const existing = this.providers.get(id);
    if (!existing) {
      throw new Error('Provider not found');
    }

    const updated: WhatsAppProvider = {
      ...existing,
      ...provider,
      id
    };

    this.providers.set(id, updated);
    console.log('[Mock WhatsApp Adapter] Provider updated:', id);
    
    return updated;
  }

  async getProvider(id: string): Promise<WhatsAppProvider | null> {
    return this.providers.get(id) || null;
  }

  async getProviders(): Promise<WhatsAppProvider[]> {
    return Array.from(this.providers.values());
  }

  async removeProvider(id: string): Promise<boolean> {
    const deleted = this.providers.delete(id);
    console.log('[Mock WhatsApp Adapter] Provider removed:', id, deleted);
    return deleted;
  }

  async setupWebhook(webhookUrl: string, events: string[]): Promise<{ success: boolean; message: string }> {
    console.log('[Mock WhatsApp Adapter] Webhook setup:', { webhookUrl, events });
    
    // Simulate webhook setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Webhook setup successfully'
    };
  }

  async verifyWebhook(verifyToken: string, challenge: string): Promise<boolean> {
    console.log('[Mock WhatsApp Adapter] Webhook verification:', { verifyToken, challenge });
    
    // Simulate verification
    return verifyToken === 'mock-verify-token';
  }

  async processWebhookEvent(event: WhatsAppWebhookEvent): Promise<void> {
    console.log('[Mock WhatsApp Adapter] Processing webhook event:', event);
    
    // Simulate event processing
    switch (event.type) {
      case 'message':
        console.log('Processing message event');
        break;
      case 'status':
        console.log('Processing status event');
        break;
      case 'template':
        console.log('Processing template event');
        break;
      case 'account':
        console.log('Processing account event');
        break;
    }
  }

  async getDeliveryStatus(messageId: string): Promise<{
    status: 'sent' | 'delivered' | 'read' | 'failed';
    deliveredAt?: Date;
    readAt?: Date;
    error?: string;
  }> {
    const message = this.messages.get(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    return {
      status: message.status as any,
      deliveredAt: message.status === 'delivered' || message.status === 'read' ? new Date() : undefined,
      readAt: message.status === 'read' ? new Date() : undefined,
      error: message.error
    };
  }

  async getWhatsAppStats(dateFrom: Date, dateTo: Date): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    totalFailed: number;
    deliveryRate: number;
    readRate: number;
    failureRate: number;
  }> {
    const deliveryRate = this.stats.totalSent > 0 ? (this.stats.totalDelivered / this.stats.totalSent) * 100 : 0;
    const readRate = this.stats.totalDelivered > 0 ? (this.stats.totalRead / this.stats.totalDelivered) * 100 : 0;
    const failureRate = this.stats.totalSent > 0 ? (this.stats.totalFailed / this.stats.totalSent) * 100 : 0;

    return {
      totalSent: this.stats.totalSent,
      totalDelivered: this.stats.totalDelivered,
      totalRead: this.stats.totalRead,
      totalFailed: this.stats.totalFailed,
      deliveryRate,
      readRate,
      failureRate
    };
  }

  async uploadMedia(file: Buffer, filename: string, contentType: string): Promise<{ mediaId: string; url: string }> {
    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const url = `https://mock-media.example.com/${mediaId}`;
    
    this.media.set(mediaId, { url, contentType, filename });
    
    console.log('[Mock WhatsApp Adapter] Media uploaded:', { mediaId, filename, contentType });
    
    return { mediaId, url };
  }

  async getMedia(mediaId: string): Promise<{ url: string; contentType: string; filename: string }> {
    const media = this.media.get(mediaId);
    if (!media) {
      throw new Error('Media not found');
    }
    
    return media;
  }

  async deleteMedia(mediaId: string): Promise<boolean> {
    const deleted = this.media.delete(mediaId);
    console.log('[Mock WhatsApp Adapter] Media deleted:', mediaId, deleted);
    return deleted;
  }

  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    details?: any;
  }> {
    try {
      // Simulate health check
      const isHealthy = Math.random() > 0.05; // 95% healthy
      
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'WhatsApp service is healthy' : 'WhatsApp service is experiencing issues',
        details: {
          providers: this.providers.size,
          templates: this.templates.size,
          messages: this.messages.size,
          media: this.media.size,
          stats: this.stats
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `WhatsApp service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

