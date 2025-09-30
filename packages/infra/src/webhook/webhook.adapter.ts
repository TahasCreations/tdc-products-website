import { WebhookPort } from '../../domain/src/ports/services/webhook.port.js';
import { WebhookService } from '../../domain/src/services/webhook.service.js';
import { PrismaClient } from '@prisma/client';

export class WebhookAdapter implements WebhookPort {
  private webhookService: WebhookService;

  constructor(private prisma: PrismaClient) {
    this.webhookService = new WebhookService(prisma);
  }

  // Subscription Management
  async createSubscription(input: any) {
    return this.webhookService.createSubscription(input);
  }

  async getSubscription(id: string, tenantId: string) {
    return this.webhookService.getSubscription(id, tenantId);
  }

  async getSubscriptions(tenantId: string, filters?: any) {
    return this.webhookService.getSubscriptions(tenantId, filters);
  }

  async updateSubscription(id: string, tenantId: string, input: any) {
    return this.webhookService.updateSubscription(id, tenantId, input);
  }

  async deleteSubscription(id: string, tenantId: string) {
    return this.webhookService.deleteSubscription(id, tenantId);
  }

  async testSubscription(id: string, tenantId: string) {
    return this.webhookService.testSubscription(id, tenantId);
  }

  // Event Management
  async createEvent(input: any) {
    return this.webhookService.createEvent(input);
  }

  async getEvent(id: string, tenantId: string) {
    return this.webhookService.getEvent(id, tenantId);
  }

  async getEvents(tenantId: string, filters?: any) {
    return this.webhookService.getEvents(tenantId, filters);
  }

  async processEvent(eventId: string, tenantId: string) {
    return this.webhookService.processEvent(eventId, tenantId);
  }

  // Delivery Management
  async createDelivery(input: any) {
    return this.webhookService.createDelivery(input);
  }

  async getDelivery(id: string, tenantId: string) {
    return this.webhookService.getDelivery(id, tenantId);
  }

  async getDeliveries(tenantId: string, filters?: any) {
    return this.webhookService.getDeliveries(tenantId, filters);
  }

  async retryDelivery(id: string, tenantId: string) {
    return this.webhookService.retryDelivery(id, tenantId);
  }

  async cancelDelivery(id: string, tenantId: string) {
    return this.webhookService.cancelDelivery(id, tenantId);
  }

  // HMAC Security
  async generateHmacSignature(payload: string, secret: string, method?: string) {
    return this.webhookService.generateHmacSignature(payload, secret, method);
  }

  async verifyHmacSignature(payload: string, signature: string, secret: string, method?: string) {
    return this.webhookService.verifyHmacSignature(payload, signature, secret, method);
  }

  // Webhook Delivery
  async deliverWebhook(deliveryId: string, tenantId: string) {
    return this.webhookService.deliverWebhook(deliveryId, tenantId);
  }

  async processPendingDeliveries(tenantId?: string) {
    return this.webhookService.processPendingDeliveries(tenantId);
  }

  // Health and Statistics
  async getWebhookStats(tenantId: string) {
    return this.webhookService.getWebhookStats(tenantId);
  }

  async getSubscriptionHealth(id: string, tenantId: string) {
    return this.webhookService.getSubscriptionHealth(id, tenantId);
  }

  async updateSubscriptionHealth(id: string, tenantId: string, isHealthy: boolean) {
    return this.webhookService.updateSubscriptionHealth(id, tenantId, isHealthy);
  }

  // Logging
  async logWebhookEvent(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL', message: string, context: any) {
    return this.webhookService.logWebhookEvent(level, message, context);
  }
}

