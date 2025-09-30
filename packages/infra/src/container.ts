import { PaymentPort } from '@tdc/domain';
import { StoragePort } from '@tdc/domain';
import { SearchPort } from '@tdc/domain';
import { QueuePort } from '@tdc/domain';
import { DbPort } from '@tdc/domain';

import { PayTRAdapter } from './payment/paytr.adapter.js';
import { S3Adapter } from './storage/s3.adapter.js';
import { MeiliAdapter } from './search/meili.adapter.js';
import { BullMQAdapter } from './queue/bullmq.adapter.js';
import { PrismaAdapter } from './database/prisma.adapter.js';

export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Payment service
    this.services.set('payment', new PayTRAdapter());
    
    // Storage service
    this.services.set('storage', new S3Adapter());
    
    // Search service
    this.services.set('search', new MeiliAdapter());
    
    // Queue service
    this.services.set('queue', new BullMQAdapter());
    
    // Database service
    this.services.set('database', new PrismaAdapter());
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  public getPaymentService(): PaymentPort {
    return this.get<PaymentPort>('payment');
  }

  public getStorageService(): StoragePort {
    return this.get<StoragePort>('storage');
  }

  public getSearchService(): SearchPort {
    return this.get<SearchPort>('search');
  }

  public getQueueService(): QueuePort {
    return this.get<QueuePort>('queue');
  }

  public getDatabaseService(): DbPort {
    return this.get<DbPort>('database');
  }

  public register<T>(serviceName: string, service: T): void {
    this.services.set(serviceName, service);
  }

  public has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();



