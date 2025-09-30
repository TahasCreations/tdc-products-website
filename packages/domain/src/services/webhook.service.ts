import { WebhookPort, WebhookSubscriptionInput, WebhookSubscriptionOutput, WebhookSubscriptionUpdateInput, WebhookDeliveryInput, WebhookDeliveryOutput, WebhookEventInput, WebhookEventOutput, HmacSignatureResult, WebhookDeliveryResult, WebhookStats, WebhookStatus } from '../ports/services/webhook.port.js';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export class WebhookService implements WebhookPort {
  constructor(private prisma: PrismaClient) {}

  // Subscription Management
  async createSubscription(input: WebhookSubscriptionInput): Promise<WebhookSubscriptionOutput> {
    const subscription = await this.prisma.webhookSubscription.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        description: input.description,
        url: input.url,
        secret: input.secret,
        events: input.events,
        verifySsl: input.verifySsl,
        includeHeaders: input.includeHeaders,
        customHeaders: input.customHeaders,
        maxRetries: input.maxRetries,
        retryDelay: input.retryDelay,
        retryBackoff: input.retryBackoff,
        timeout: input.timeout,
        metadata: input.metadata
      }
    });

    return this.mapSubscriptionToOutput(subscription);
  }

  async getSubscription(id: string, tenantId: string): Promise<WebhookSubscriptionOutput | null> {
    const subscription = await this.prisma.webhookSubscription.findFirst({
      where: { id, tenantId }
    });

    return subscription ? this.mapSubscriptionToOutput(subscription) : null;
  }

  async getSubscriptions(tenantId: string, filters?: {
    isActive?: boolean;
    isHealthy?: boolean;
    events?: string[];
  }): Promise<WebhookSubscriptionOutput[]> {
    const where: any = { tenantId };

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isHealthy !== undefined) {
      where.isHealthy = filters.isHealthy;
    }

    if (filters?.events && filters.events.length > 0) {
      where.events = {
        hasSome: filters.events
      };
    }

    const subscriptions = await this.prisma.webhookSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return subscriptions.map(sub => this.mapSubscriptionToOutput(sub));
  }

  async updateSubscription(id: string, tenantId: string, input: WebhookSubscriptionUpdateInput): Promise<WebhookSubscriptionOutput> {
    const subscription = await this.prisma.webhookSubscription.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.url && { url: input.url }),
        ...(input.secret && { secret: input.secret }),
        ...(input.events && { events: input.events }),
        ...(input.verifySsl !== undefined && { verifySsl: input.verifySsl }),
        ...(input.includeHeaders !== undefined && { includeHeaders: input.includeHeaders }),
        ...(input.customHeaders !== undefined && { customHeaders: input.customHeaders }),
        ...(input.maxRetries !== undefined && { maxRetries: input.maxRetries }),
        ...(input.retryDelay !== undefined && { retryDelay: input.retryDelay }),
        ...(input.retryBackoff !== undefined && { retryBackoff: input.retryBackoff }),
        ...(input.timeout !== undefined && { timeout: input.timeout }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.metadata !== undefined && { metadata: input.metadata })
      }
    });

    return this.mapSubscriptionToOutput(subscription);
  }

  async deleteSubscription(id: string, tenantId: string): Promise<boolean> {
    try {
      await this.prisma.webhookSubscription.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async testSubscription(id: string, tenantId: string): Promise<WebhookDeliveryResult> {
    const subscription = await this.getSubscription(id, tenantId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const testPayload = {
      eventType: 'webhook.test',
      eventId: `test-${Date.now()}`,
      data: {
        message: 'This is a test webhook',
        timestamp: new Date().toISOString(),
        subscription: {
          id: subscription.id,
          name: subscription.name
        }
      },
      metadata: {
        test: true
      }
    };

    return this.deliverWebhookPayload(subscription.url, subscription.secret, testPayload, {
      verifySsl: subscription.verifySsl,
      includeHeaders: subscription.includeHeaders,
      customHeaders: subscription.customHeaders,
      timeout: subscription.timeout
    });
  }

  // Event Management
  async createEvent(input: WebhookEventInput): Promise<WebhookEventOutput> {
    const event = await this.prisma.webhookEvent.create({
      data: {
        tenantId: input.tenantId,
        eventType: input.eventType,
        eventVersion: input.eventVersion,
        source: input.source,
        data: input.data,
        metadata: input.metadata
      }
    });

    return this.mapEventToOutput(event);
  }

  async getEvent(id: string, tenantId: string): Promise<WebhookEventOutput | null> {
    const event = await this.prisma.webhookEvent.findFirst({
      where: { id, tenantId }
    });

    return event ? this.mapEventToOutput(event) : null;
  }

  async getEvents(tenantId: string, filters?: {
    eventType?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookEventOutput[]> {
    const where: any = { tenantId };

    if (filters?.eventType) {
      where.eventType = filters.eventType;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const events = await this.prisma.webhookEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    });

    return events.map(event => this.mapEventToOutput(event));
  }

  async processEvent(eventId: string, tenantId: string): Promise<void> {
    const event = await this.prisma.webhookEvent.findFirst({
      where: { id: eventId, tenantId }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Update event status to processing
    await this.prisma.webhookEvent.update({
      where: { id: eventId },
      data: { status: 'PROCESSING' }
    });

    try {
      // Find active subscriptions for this event type
      const subscriptions = await this.prisma.webhookSubscription.findMany({
        where: {
          tenantId,
          isActive: true,
          events: {
            has: event.eventType
          }
        }
      });

      // Create deliveries for each subscription
      for (const subscription of subscriptions) {
        await this.createDelivery({
          subscriptionId: subscription.id,
          tenantId,
          eventType: event.eventType,
          eventId: event.id,
          payload: event.data,
          metadata: event.metadata
        });
      }

      // Mark event as processed
      await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: { 
          status: 'PROCESSED',
          processedAt: new Date()
        }
      });
    } catch (error) {
      // Mark event as failed
      await this.prisma.webhookEvent.update({
        where: { id: eventId },
        data: { 
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }

  // Delivery Management
  async createDelivery(input: WebhookDeliveryInput): Promise<WebhookDeliveryOutput> {
    const delivery = await this.prisma.webhookDelivery.create({
      data: {
        subscriptionId: input.subscriptionId,
        tenantId: input.tenantId,
        eventType: input.eventType,
        eventId: input.eventId,
        payload: input.payload,
        headers: input.headers,
        metadata: input.metadata
      }
    });

    return this.mapDeliveryToOutput(delivery);
  }

  async getDelivery(id: string, tenantId: string): Promise<WebhookDeliveryOutput | null> {
    const delivery = await this.prisma.webhookDelivery.findFirst({
      where: { id, tenantId }
    });

    return delivery ? this.mapDeliveryToOutput(delivery) : null;
  }

  async getDeliveries(tenantId: string, filters?: {
    subscriptionId?: string;
    status?: WebhookStatus;
    eventType?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookDeliveryOutput[]> {
    const where: any = { tenantId };

    if (filters?.subscriptionId) {
      where.subscriptionId = filters.subscriptionId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.eventType) {
      where.eventType = filters.eventType;
    }

    const deliveries = await this.prisma.webhookDelivery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    });

    return deliveries.map(delivery => this.mapDeliveryToOutput(delivery));
  }

  async retryDelivery(id: string, tenantId: string): Promise<WebhookDeliveryResult> {
    const delivery = await this.prisma.webhookDelivery.findFirst({
      where: { id, tenantId },
      include: { subscription: true }
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (delivery.attemptCount >= delivery.maxRetries) {
      throw new Error('Maximum retry attempts reached');
    }

    // Update delivery status to retrying
    await this.prisma.webhookDelivery.update({
      where: { id },
      data: { 
        status: 'RETRYING',
        attemptCount: delivery.attemptCount + 1
      }
    });

    // Attempt delivery
    const result = await this.deliverWebhookPayload(
      delivery.subscription.url,
      delivery.subscription.secret,
      delivery.payload,
      {
        verifySsl: delivery.subscription.verifySsl,
        includeHeaders: delivery.subscription.includeHeaders,
        customHeaders: delivery.subscription.customHeaders,
        timeout: delivery.subscription.timeout
      }
    );

    // Update delivery with result
    const updateData: any = {
      httpStatus: result.httpStatus,
      responseBody: result.responseBody,
      responseHeaders: result.responseHeaders,
      duration: result.duration,
      completedAt: new Date()
    };

    if (result.success) {
      updateData.status = 'DELIVERED';
      updateData.errorMessage = null;
      updateData.errorCode = null;
      updateData.errorDetails = null;
    } else {
      updateData.status = 'FAILED';
      updateData.errorMessage = result.errorMessage;
      updateData.errorCode = result.errorCode;
      updateData.errorDetails = { shouldRetry: result.shouldRetry };

      if (result.shouldRetry && result.retryAfter) {
        updateData.nextRetryAt = new Date(Date.now() + result.retryAfter);
      } else {
        updateData.status = 'EXPIRED';
      }
    }

    await this.prisma.webhookDelivery.update({
      where: { id },
      data: updateData
    });

    return result;
  }

  async cancelDelivery(id: string, tenantId: string): Promise<boolean> {
    try {
      await this.prisma.webhookDelivery.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // HMAC Security
  async generateHmacSignature(payload: string, secret: string, method: string = 'sha256'): Promise<HmacSignatureResult> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(16).toString('hex');
    const signatureString = `${payload}.${timestamp}.${nonce}`;
    
    const signature = crypto
      .createHmac(method, secret)
      .update(signatureString)
      .digest('hex');

    return {
      signature,
      method,
      timestamp,
      nonce
    };
  }

  async verifyHmacSignature(payload: string, signature: string, secret: string, method: string = 'sha256'): Promise<boolean> {
    try {
      // Extract timestamp and nonce from signature (assuming format: signature.timestamp.nonce)
      const parts = signature.split('.');
      if (parts.length !== 3) return false;

      const [sig, timestamp, nonce] = parts;
      const signatureString = `${payload}.${timestamp}.${nonce}`;
      
      const expectedSignature = crypto
        .createHmac(method, secret)
        .update(signatureString)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(sig, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  // Webhook Delivery
  async deliverWebhook(deliveryId: string, tenantId: string): Promise<WebhookDeliveryResult> {
    const delivery = await this.prisma.webhookDelivery.findFirst({
      where: { id: deliveryId, tenantId },
      include: { subscription: true }
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    // Update delivery status to sending
    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: { 
        status: 'SENDING',
        startedAt: new Date()
      }
    });

    // Attempt delivery
    const result = await this.deliverWebhookPayload(
      delivery.subscription.url,
      delivery.subscription.secret,
      delivery.payload,
      {
        verifySsl: delivery.subscription.verifySsl,
        includeHeaders: delivery.subscription.includeHeaders,
        customHeaders: delivery.subscription.customHeaders,
        timeout: delivery.subscription.timeout
      }
    );

    // Update delivery with result
    const updateData: any = {
      httpStatus: result.httpStatus,
      responseBody: result.responseBody,
      responseHeaders: result.responseHeaders,
      duration: result.duration,
      completedAt: new Date()
    };

    if (result.success) {
      updateData.status = 'DELIVERED';
      updateData.errorMessage = null;
      updateData.errorCode = null;
      updateData.errorDetails = null;
    } else {
      updateData.status = 'FAILED';
      updateData.errorMessage = result.errorMessage;
      updateData.errorCode = result.errorCode;
      updateData.errorDetails = { shouldRetry: result.shouldRetry };

      if (result.shouldRetry && result.retryAfter) {
        updateData.nextRetryAt = new Date(Date.now() + result.retryAfter);
      } else {
        updateData.status = 'EXPIRED';
      }
    }

    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: updateData
    });

    return result;
  }

  async processPendingDeliveries(tenantId?: string): Promise<void> {
    const where: any = {
      status: 'PENDING',
      ...(tenantId && { tenantId })
    };

    const pendingDeliveries = await this.prisma.webhookDelivery.findMany({
      where,
      include: { subscription: true },
      orderBy: { createdAt: 'asc' },
      take: 100
    });

    for (const delivery of pendingDeliveries) {
      try {
        await this.deliverWebhook(delivery.id, delivery.tenantId);
      } catch (error) {
        console.error(`Failed to process delivery ${delivery.id}:`, error);
      }
    }
  }

  // Health and Statistics
  async getWebhookStats(tenantId: string): Promise<WebhookStats> {
    const [
      totalSubscriptions,
      activeSubscriptions,
      healthySubscriptions,
      totalDeliveries,
      successfulDeliveries,
      failedDeliveries,
      pendingDeliveries,
      deliveriesByStatus,
      eventsByType
    ] = await Promise.all([
      this.prisma.webhookSubscription.count({ where: { tenantId } }),
      this.prisma.webhookSubscription.count({ where: { tenantId, isActive: true } }),
      this.prisma.webhookSubscription.count({ where: { tenantId, isHealthy: true } }),
      this.prisma.webhookDelivery.count({ where: { tenantId } }),
      this.prisma.webhookDelivery.count({ where: { tenantId, status: 'DELIVERED' } }),
      this.prisma.webhookDelivery.count({ where: { tenantId, status: 'FAILED' } }),
      this.prisma.webhookDelivery.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.webhookDelivery.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { status: true }
      }),
      this.prisma.webhookEvent.groupBy({
        by: ['eventType'],
        where: { tenantId },
        _count: { eventType: true }
      })
    ]);

    const successRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0;

    // Calculate average delivery time
    const completedDeliveries = await this.prisma.webhookDelivery.findMany({
      where: { 
        tenantId,
        status: 'DELIVERED',
        duration: { not: null }
      },
      select: { duration: true }
    });

    const averageDeliveryTime = completedDeliveries.length > 0 
      ? completedDeliveries.reduce((sum, d) => sum + (d.duration || 0), 0) / completedDeliveries.length
      : 0;

    return {
      totalSubscriptions,
      activeSubscriptions,
      healthySubscriptions,
      totalDeliveries,
      successfulDeliveries,
      failedDeliveries,
      pendingDeliveries,
      averageDeliveryTime,
      successRate,
      eventsByType: eventsByType.reduce((acc, item) => {
        acc[item.eventType] = item._count.eventType;
        return acc;
      }, {} as Record<string, number>),
      deliveriesByStatus: deliveriesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  async getSubscriptionHealth(id: string, tenantId: string): Promise<{
    isHealthy: boolean;
    lastDeliveryAt: Date | null;
    consecutiveFailures: number;
    successRate: number;
  }> {
    const subscription = await this.prisma.webhookSubscription.findFirst({
      where: { id, tenantId },
      select: {
        isHealthy: true,
        lastDeliveryAt: true,
        consecutiveFailures: true,
        totalDeliveries: true,
        successfulDeliveries: true
      }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const successRate = subscription.totalDeliveries > 0 
      ? (subscription.successfulDeliveries / subscription.totalDeliveries) * 100 
      : 0;

    return {
      isHealthy: subscription.isHealthy,
      lastDeliveryAt: subscription.lastDeliveryAt,
      consecutiveFailures: subscription.consecutiveFailures,
      successRate
    };
  }

  async updateSubscriptionHealth(id: string, tenantId: string, isHealthy: boolean): Promise<void> {
    await this.prisma.webhookSubscription.update({
      where: { id },
      data: { isHealthy }
    });
  }

  // Logging
  async logWebhookEvent(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL', message: string, context: {
    tenantId: string;
    subscriptionId?: string;
    deliveryId?: string;
    requestUrl?: string;
    requestMethod?: string;
    requestHeaders?: Record<string, string>;
    requestBody?: string;
    responseStatus?: number;
    responseHeaders?: Record<string, string>;
    responseBody?: string;
    errorCode?: string;
    errorMessage?: string;
    stackTrace?: string;
    duration?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.prisma.webhookLog.create({
      data: {
        tenantId: context.tenantId,
        subscriptionId: context.subscriptionId,
        deliveryId: context.deliveryId,
        level,
        message,
        context: {
          requestUrl: context.requestUrl,
          requestMethod: context.requestMethod,
          requestHeaders: context.requestHeaders,
          requestBody: context.requestBody,
          responseStatus: context.responseStatus,
          responseHeaders: context.responseHeaders,
          responseBody: context.responseBody,
          errorCode: context.errorCode,
          errorMessage: context.errorMessage,
          stackTrace: context.stackTrace,
          duration: context.duration,
          ...context.metadata
        },
        requestUrl: context.requestUrl,
        requestMethod: context.requestMethod,
        requestHeaders: context.requestHeaders,
        requestBody: context.requestBody,
        responseStatus: context.responseStatus,
        responseHeaders: context.responseHeaders,
        responseBody: context.responseBody,
        errorCode: context.errorCode,
        errorMessage: context.errorMessage,
        stackTrace: context.stackTrace,
        duration: context.duration,
        metadata: context.metadata
      }
    });
  }

  // Private helper methods
  private async deliverWebhookPayload(
    url: string, 
    secret: string, 
    payload: any, 
    options: {
      verifySsl: boolean;
      includeHeaders: boolean;
      customHeaders?: Record<string, string> | null;
      timeout: number;
    }
  ): Promise<WebhookDeliveryResult> {
    const startTime = Date.now();
    const payloadString = JSON.stringify(payload);
    
    try {
      // Generate HMAC signature
      const signature = await this.generateHmacSignature(payloadString, secret);
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'TDC-Webhook/1.0',
        'X-Webhook-Signature': `${signature.signature}.${signature.timestamp}.${signature.nonce}`,
        'X-Webhook-Method': signature.method,
        'X-Webhook-Timestamp': signature.timestamp.toString(),
        'X-Webhook-Nonce': signature.nonce
      };

      if (options.includeHeaders) {
        headers['X-Webhook-Headers'] = JSON.stringify(options.customHeaders || {});
      }

      // Add custom headers
      if (options.customHeaders) {
        Object.assign(headers, options.customHeaders);
      }

      // Make HTTP request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: payloadString,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      const responseBody = await response.text();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const success = response.ok;
      const shouldRetry = !success && response.status >= 500;

      return {
        success,
        httpStatus: response.status,
        responseBody,
        responseHeaders,
        duration,
        errorMessage: success ? undefined : `HTTP ${response.status}: ${response.statusText}`,
        errorCode: success ? undefined : `HTTP_${response.status}`,
        shouldRetry,
        retryAfter: shouldRetry ? this.calculateRetryDelay(response.status) : undefined
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = error instanceof Error && error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
      const shouldRetry = errorCode !== 'TIMEOUT';

      return {
        success: false,
        duration,
        errorMessage,
        errorCode,
        shouldRetry,
        retryAfter: shouldRetry ? 5000 : undefined
      };
    }
  }

  private calculateRetryDelay(httpStatus: number): number {
    // Exponential backoff based on HTTP status
    if (httpStatus >= 500) {
      return 5000; // 5 seconds for server errors
    } else if (httpStatus === 429) {
      return 30000; // 30 seconds for rate limiting
    } else if (httpStatus >= 400) {
      return 10000; // 10 seconds for client errors
    }
    return 5000; // Default 5 seconds
  }

  private mapSubscriptionToOutput(subscription: any): WebhookSubscriptionOutput {
    return {
      id: subscription.id,
      tenantId: subscription.tenantId,
      name: subscription.name,
      description: subscription.description,
      url: subscription.url,
      events: subscription.events,
      verifySsl: subscription.verifySsl,
      includeHeaders: subscription.includeHeaders,
      customHeaders: subscription.customHeaders,
      maxRetries: subscription.maxRetries,
      retryDelay: subscription.retryDelay,
      retryBackoff: subscription.retryBackoff,
      timeout: subscription.timeout,
      isActive: subscription.isActive,
      isHealthy: subscription.isHealthy,
      lastDeliveryAt: subscription.lastDeliveryAt,
      lastSuccessAt: subscription.lastSuccessAt,
      lastFailureAt: subscription.lastFailureAt,
      consecutiveFailures: subscription.consecutiveFailures,
      totalDeliveries: subscription.totalDeliveries,
      successfulDeliveries: subscription.successfulDeliveries,
      failedDeliveries: subscription.failedDeliveries,
      metadata: subscription.metadata,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt
    };
  }

  private mapDeliveryToOutput(delivery: any): WebhookDeliveryOutput {
    return {
      id: delivery.id,
      subscriptionId: delivery.subscriptionId,
      tenantId: delivery.tenantId,
      eventType: delivery.eventType,
      eventId: delivery.eventId,
      payload: delivery.payload,
      headers: delivery.headers,
      status: delivery.status,
      httpStatus: delivery.httpStatus,
      responseBody: delivery.responseBody,
      responseHeaders: delivery.responseHeaders,
      attemptCount: delivery.attemptCount,
      maxRetries: delivery.maxRetries,
      nextRetryAt: delivery.nextRetryAt,
      startedAt: delivery.startedAt,
      completedAt: delivery.completedAt,
      duration: delivery.duration,
      errorMessage: delivery.errorMessage,
      errorCode: delivery.errorCode,
      errorDetails: delivery.errorDetails,
      signature: delivery.signature,
      signatureMethod: delivery.signatureMethod,
      metadata: delivery.metadata,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    };
  }

  private mapEventToOutput(event: any): WebhookEventOutput {
    return {
      id: event.id,
      tenantId: event.tenantId,
      eventType: event.eventType,
      eventVersion: event.eventVersion,
      source: event.source,
      data: event.data,
      metadata: event.metadata,
      status: event.status,
      processedAt: event.processedAt,
      errorMessage: event.errorMessage,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };
  }
}

