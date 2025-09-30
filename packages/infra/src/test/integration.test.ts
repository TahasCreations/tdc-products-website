import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { container } from '../container.js';
import { PaymentPort, StoragePort, SearchPort, QueuePort, DbPort } from '@tdc/domain';

describe('Port & Adapter Integration Tests', () => {
  let paymentService: PaymentPort;
  let storageService: StoragePort;
  let searchService: SearchPort;
  let queueService: QueuePort;
  let dbService: DbPort;

  beforeAll(() => {
    // Get services from DI container
    paymentService = container.getPaymentService();
    storageService = container.getStorageService();
    searchService = container.getSearchService();
    queueService = container.getQueueService();
    dbService = container.getDatabaseService();
  });

  afterAll(async () => {
    // Cleanup
    await dbService.close();
  });

  describe('Payment Service', () => {
    it('should create checkout session', async () => {
      const paymentRequest = {
        amount: 100.50,
        currency: 'TRY',
        orderId: 'test-order-123',
        customerId: 'test-customer-456',
        paymentMethod: 'credit_card' as const,
        metadata: {
          email: 'test@example.com',
          userName: 'Test User',
        },
      };

      const result = await paymentService.createCheckoutSession(paymentRequest);
      
      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.paymentUrl).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should get payment status', async () => {
      const transactionId = 'test-transaction-123';
      const status = await paymentService.getPaymentStatus(transactionId);
      
      expect(status).toBeDefined();
      expect(status.transactionId).toBe(transactionId);
      expect(status.status).toBeDefined();
    });
  });

  describe('Storage Service', () => {
    it('should upload object', async () => {
      const buffer = Buffer.from('test content');
      const options = {
        bucket: 'test-bucket',
        key: 'test-file.txt',
        contentType: 'text/plain',
        metadata: {
          test: 'value',
        },
      };

      const result = await storageService.putObject(buffer, options);
      
      expect(result.success).toBe(true);
      expect(result.key).toBe(options.key);
      expect(result.url).toBeDefined();
    });

    it('should generate signed URL', async () => {
      const options = {
        bucket: 'test-bucket',
        key: 'test-file.txt',
        expiresIn: 3600,
        operation: 'getObject' as const,
      };

      const result = await storageService.getSignedUrl(options);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('Search Service', () => {
    it('should index document', async () => {
      const document = {
        id: 'test-doc-123',
        index: 'test-index',
        content: {
          title: 'Test Product',
          description: 'Test Description',
          price: 100,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await searchService.indexDocument(document);
      
      expect(result.success).toBe(true);
      expect(result.index).toBe(document.index);
    });

    it('should search documents', async () => {
      const query = {
        index: 'test-index',
        query: 'test product',
        limit: 10,
        offset: 0,
      };

      const result = await searchService.search(query);
      
      expect(result).toBeDefined();
      expect(result.hits).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should perform health check', async () => {
      const isHealthy = await searchService.healthCheck();
      expect(typeof isHealthy).toBe('boolean');
    });
  });

  describe('Queue Service', () => {
    it('should publish job', async () => {
      const job = {
        id: 'test-job-123',
        name: 'test-job',
        data: {
          message: 'test message',
          timestamp: Date.now(),
        },
        priority: 1,
      };

      const result = await queueService.publish(job);
      
      expect(result.success).toBe(true);
      expect(result.jobId).toBeDefined();
    });

    it('should get queue stats', async () => {
      const stats = await queueService.getQueueStats('test-queue');
      
      expect(stats).toBeDefined();
      expect(typeof stats.waiting).toBe('number');
      expect(typeof stats.active).toBe('number');
      expect(typeof stats.completed).toBe('number');
      expect(typeof stats.failed).toBe('number');
      expect(typeof stats.delayed).toBe('number');
    });
  });

  describe('Database Service', () => {
    it('should perform health check', async () => {
      const isHealthy = await dbService.healthCheck();
      expect(typeof isHealthy).toBe('boolean');
    });

    it('should count records', async () => {
      const count = await dbService.count('users');
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

