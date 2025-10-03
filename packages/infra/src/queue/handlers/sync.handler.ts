import { Job, JobResult } from '../job-service.js';
import { SyncJobData } from '../job-service.js';
import { PrismaProductRepository, PrismaOrderRepository } from '../../database/repositories/index.js';
import { env } from '@tdc/config';

export class SyncHandler {
  private productRepo: PrismaProductRepository;
  private orderRepo: PrismaOrderRepository;

  constructor() {
    this.productRepo = new PrismaProductRepository();
    this.orderRepo = new PrismaOrderRepository();
  }

  async process(job: Job<SyncJobData>): Promise<JobResult> {
    const { jobId, tenantId, syncType, sourceSystem, targetSystem, batchSize = 100, lastSyncDate } = job.data;

    console.log(`🔄 Starting ${syncType} sync from ${sourceSystem} to ${targetSystem}`);

    try {
      let syncResult: any;

      switch (syncType) {
        case 'products':
          syncResult = await this.syncProducts(tenantId, sourceSystem, targetSystem, batchSize, lastSyncDate);
          break;

        case 'orders':
          syncResult = await this.syncOrders(tenantId, sourceSystem, targetSystem, batchSize, lastSyncDate);
          break;

        case 'customers':
          syncResult = await this.syncCustomers(tenantId, sourceSystem, targetSystem, batchSize, lastSyncDate);
          break;

        case 'inventory':
          syncResult = await this.syncInventory(tenantId, sourceSystem, targetSystem, batchSize, lastSyncDate);
          break;

        default:
          throw new Error(`Unknown sync type: ${syncType}`);
      }

      console.log(`✅ ${syncType} sync completed`);

      return {
        success: true,
        jobId,
        result: {
          syncType,
          sourceSystem,
          targetSystem,
          recordsProcessed: syncResult.recordsProcessed,
          recordsCreated: syncResult.recordsCreated,
          recordsUpdated: syncResult.recordsUpdated,
          recordsSkipped: syncResult.recordsSkipped,
          errors: syncResult.errors,
          duration: syncResult.duration,
          lastSyncDate: syncResult.lastSyncDate,
        },
        metadata: {
          tenantId,
          syncType,
          sourceSystem,
          targetSystem,
          batchSize,
          lastSyncDate,
        },
      };

    } catch (error: any) {
      console.error(`❌ ${syncType} sync failed:`, error.message);
      
      return {
        success: false,
        jobId,
        error: error.message,
        metadata: {
          tenantId,
          syncType,
          sourceSystem,
          targetSystem,
        },
      };
    }
  }

  private async syncProducts(tenantId: string, sourceSystem: string, targetSystem: string, batchSize: number, lastSyncDate?: string) {
    console.log(`📦 Syncing products from ${sourceSystem} to ${targetSystem}`);
    
    const startTime = Date.now();
    let recordsProcessed = 0;
    let recordsCreated = 0;
    let recordsUpdated = 0;
    let recordsSkipped = 0;
    const errors: any[] = [];

    try {
      // Get products from source system
      const sourceProducts = await this.getSourceProducts(sourceSystem, tenantId, lastSyncDate);
      console.log(`📥 Retrieved ${sourceProducts.length} products from ${sourceSystem}`);

      // Process in batches
      for (let i = 0; i < sourceProducts.length; i += batchSize) {
        const batch = sourceProducts.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sourceProducts.length / batchSize)}`);

        for (const sourceProduct of batch) {
          try {
            recordsProcessed++;

            // Check if product exists in target system
            const existingProduct = await this.getTargetProduct(targetSystem, sourceProduct.id);
            
            if (existingProduct) {
              // Update existing product
              await this.updateTargetProduct(targetSystem, sourceProduct);
              recordsUpdated++;
              console.log(`✅ Updated product: ${sourceProduct.name}`);
            } else {
              // Create new product
              await this.createTargetProduct(targetSystem, sourceProduct);
              recordsCreated++;
              console.log(`➕ Created product: ${sourceProduct.name}`);
            }

          } catch (error: any) {
            recordsSkipped++;
            errors.push({
              recordId: sourceProduct.id,
              error: error.message,
              operation: 'sync-product',
            });
            console.error(`❌ Failed to sync product ${sourceProduct.id}:`, error.message);
          }
        }

        // Add delay between batches to avoid overwhelming the target system
        if (i + batchSize < sourceProducts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Product sync completed in ${duration}ms`);

      return {
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsSkipped,
        errors,
        duration,
        lastSyncDate: new Date().toISOString(),
      };

    } catch (error: any) {
      console.error(`❌ Product sync failed:`, error.message);
      throw error;
    }
  }

  private async syncOrders(tenantId: string, sourceSystem: string, targetSystem: string, batchSize: number, lastSyncDate?: string) {
    console.log(`📋 Syncing orders from ${sourceSystem} to ${targetSystem}`);
    
    const startTime = Date.now();
    let recordsProcessed = 0;
    let recordsCreated = 0;
    let recordsUpdated = 0;
    let recordsSkipped = 0;
    const errors: any[] = [];

    try {
      // Get orders from source system
      const sourceOrders = await this.getSourceOrders(sourceSystem, tenantId, lastSyncDate);
      console.log(`📥 Retrieved ${sourceOrders.length} orders from ${sourceSystem}`);

      // Process in batches
      for (let i = 0; i < sourceOrders.length; i += batchSize) {
        const batch = sourceOrders.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sourceOrders.length / batchSize)}`);

        for (const sourceOrder of batch) {
          try {
            recordsProcessed++;

            // Check if order exists in target system
            const existingOrder = await this.getTargetOrder(targetSystem, sourceOrder.id);
            
            if (existingOrder) {
              // Update existing order
              await this.updateTargetOrder(targetSystem, sourceOrder);
              recordsUpdated++;
              console.log(`✅ Updated order: ${sourceOrder.orderNumber}`);
            } else {
              // Create new order
              await this.createTargetOrder(targetSystem, sourceOrder);
              recordsCreated++;
              console.log(`➕ Created order: ${sourceOrder.orderNumber}`);
            }

          } catch (error: any) {
            recordsSkipped++;
            errors.push({
              recordId: sourceOrder.id,
              error: error.message,
              operation: 'sync-order',
            });
            console.error(`❌ Failed to sync order ${sourceOrder.id}:`, error.message);
          }
        }

        // Add delay between batches
        if (i + batchSize < sourceOrders.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Order sync completed in ${duration}ms`);

      return {
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsSkipped,
        errors,
        duration,
        lastSyncDate: new Date().toISOString(),
      };

    } catch (error: any) {
      console.error(`❌ Order sync failed:`, error.message);
      throw error;
    }
  }

  private async syncCustomers(tenantId: string, sourceSystem: string, targetSystem: string, batchSize: number, lastSyncDate?: string) {
    console.log(`👥 Syncing customers from ${sourceSystem} to ${targetSystem}`);
    
    // Simulate customer sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      recordsProcessed: 50,
      recordsCreated: 30,
      recordsUpdated: 20,
      recordsSkipped: 0,
      errors: [],
      duration: 2000,
      lastSyncDate: new Date().toISOString(),
    };
  }

  private async syncInventory(tenantId: string, sourceSystem: string, targetSystem: string, batchSize: number, lastSyncDate?: string) {
    console.log(`📦 Syncing inventory from ${sourceSystem} to ${targetSystem}`);
    
    // Simulate inventory sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      recordsProcessed: 100,
      recordsCreated: 0,
      recordsUpdated: 100,
      recordsSkipped: 0,
      errors: [],
      duration: 1500,
      lastSyncDate: new Date().toISOString(),
    };
  }

  // Source system methods (simulated)
  private async getSourceProducts(sourceSystem: string, tenantId: string, lastSyncDate?: string) {
    console.log(`📥 Fetching products from ${sourceSystem}`);
    
    // Simulate API call to source system
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return [
      {
        id: 'prod-1',
        name: 'Product 1',
        sku: 'SKU-001',
        price: 100.00,
        description: 'Test product 1',
        category: 'Electronics',
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-2',
        name: 'Product 2',
        sku: 'SKU-002',
        price: 200.00,
        description: 'Test product 2',
        category: 'Clothing',
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private async getSourceOrders(sourceSystem: string, tenantId: string, lastSyncDate?: string) {
    console.log(`📥 Fetching orders from ${sourceSystem}`);
    
    // Simulate API call to source system
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return [
      {
        id: 'order-1',
        orderNumber: 'ORD-001',
        customerEmail: 'customer1@example.com',
        totalAmount: 150.00,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Target system methods (simulated)
  private async getTargetProduct(targetSystem: string, productId: string) {
    // Simulate check in target system
    await new Promise(resolve => setTimeout(resolve, 100));
    return null; // Assume product doesn't exist
  }

  private async createTargetProduct(targetSystem: string, product: any) {
    console.log(`➕ Creating product in ${targetSystem}: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async updateTargetProduct(targetSystem: string, product: any) {
    console.log(`🔄 Updating product in ${targetSystem}: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async getTargetOrder(targetSystem: string, orderId: string) {
    // Simulate check in target system
    await new Promise(resolve => setTimeout(resolve, 100));
    return null; // Assume order doesn't exist
  }

  private async createTargetOrder(targetSystem: string, order: any) {
    console.log(`➕ Creating order in ${targetSystem}: ${order.orderNumber}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async updateTargetOrder(targetSystem: string, order: any) {
    console.log(`🔄 Updating order in ${targetSystem}: ${order.orderNumber}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}
