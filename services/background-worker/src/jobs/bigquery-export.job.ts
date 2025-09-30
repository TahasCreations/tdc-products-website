import { Job, Worker } from 'bullmq';
import { BigQuery } from '@google-cloud/bigquery';
import { PrismaClient } from '@prisma/client';

export interface BigQueryExportJobData {
  tenantId: string;
  startDate: string;
  endDate: string;
  eventTypes?: string[];
  batchSize?: number;
}

export interface BigQueryEventData {
  event_id: string;
  tenant_id: string;
  event_type: string;
  event_version: string;
  source: string;
  data: any;
  metadata: any;
  status: string;
  processed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields for analytics
  event_date: string;
  event_hour: number;
  event_day_of_week: number;
  event_month: number;
  event_year: number;
}

export class BigQueryExportJob {
  private bigquery: BigQuery;
  private prisma: PrismaClient;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    this.prisma = new PrismaClient();
  }

  async process(job: Job<BigQueryExportJobData>) {
    const { tenantId, startDate, endDate, eventTypes, batchSize = 1000 } = job.data;

    try {
      console.log(`Starting BigQuery export for tenant ${tenantId} from ${startDate} to ${endDate}`);

      // Get dataset and table references
      const datasetId = process.env.BIGQUERY_DATASET_ID || 'tdc_analytics';
      const tableId = process.env.BIGQUERY_EVENTS_TABLE_ID || 'events';

      const dataset = this.bigquery.dataset(datasetId);
      const table = dataset.table(tableId);

      // Ensure dataset exists
      await this.ensureDatasetExists(datasetId);

      // Ensure table exists
      await this.ensureTableExists(datasetId, tableId);

      // Export events in batches
      let offset = 0;
      let totalExported = 0;
      let hasMore = true;

      while (hasMore) {
        const events = await this.getEventsBatch(tenantId, startDate, endDate, eventTypes, offset, batchSize);
        
        if (events.length === 0) {
          hasMore = false;
          break;
        }

        // Transform events for BigQuery
        const bigQueryEvents = events.map(event => this.transformEventForBigQuery(event));

        // Insert batch into BigQuery
        await this.insertBatchIntoBigQuery(table, bigQueryEvents);

        totalExported += events.length;
        offset += batchSize;

        console.log(`Exported ${events.length} events (total: ${totalExported})`);

        // Update job progress
        await job.updateProgress(Math.min((offset / (offset + events.length)) * 100, 95));
      }

      console.log(`BigQuery export completed. Total events exported: ${totalExported}`);

      // Mark events as exported
      await this.markEventsAsExported(tenantId, startDate, endDate);

      await job.updateProgress(100);

    } catch (error) {
      console.error(`BigQuery export failed for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  private async ensureDatasetExists(datasetId: string) {
    try {
      const dataset = this.bigquery.dataset(datasetId);
      const [exists] = await dataset.exists();
      
      if (!exists) {
        console.log(`Creating BigQuery dataset: ${datasetId}`);
        await dataset.create({
          location: process.env.BIGQUERY_LOCATION || 'US',
          description: 'TDC Analytics Dataset'
        });
      }
    } catch (error) {
      console.error('Error ensuring dataset exists:', error);
      throw error;
    }
  }

  private async ensureTableExists(datasetId: string, tableId: string) {
    try {
      const dataset = this.bigquery.dataset(datasetId);
      const table = dataset.table(tableId);
      const [exists] = await table.exists();
      
      if (!exists) {
        console.log(`Creating BigQuery table: ${datasetId}.${tableId}`);
        
        const schema = [
          { name: 'event_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'tenant_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'event_type', type: 'STRING', mode: 'REQUIRED' },
          { name: 'event_version', type: 'STRING', mode: 'REQUIRED' },
          { name: 'source', type: 'STRING', mode: 'REQUIRED' },
          { name: 'data', type: 'JSON', mode: 'NULLABLE' },
          { name: 'metadata', type: 'JSON', mode: 'NULLABLE' },
          { name: 'status', type: 'STRING', mode: 'REQUIRED' },
          { name: 'processed_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'error_message', type: 'STRING', mode: 'NULLABLE' },
          { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'event_date', type: 'DATE', mode: 'REQUIRED' },
          { name: 'event_hour', type: 'INTEGER', mode: 'REQUIRED' },
          { name: 'event_day_of_week', type: 'INTEGER', mode: 'REQUIRED' },
          { name: 'event_month', type: 'INTEGER', mode: 'REQUIRED' },
          { name: 'event_year', type: 'INTEGER', mode: 'REQUIRED' }
        ];

        await table.create({
          schema,
          description: 'TDC Events Data'
        });
      }
    } catch (error) {
      console.error('Error ensuring table exists:', error);
      throw error;
    }
  }

  private async getEventsBatch(
    tenantId: string,
    startDate: string,
    endDate: string,
    eventTypes?: string[],
    offset: number = 0,
    limit: number = 1000
  ) {
    const where: any = {
      tenantId,
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    if (eventTypes && eventTypes.length > 0) {
      where.eventType = {
        in: eventTypes
      };
    }

    return this.prisma.webhookEvent.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit
    });
  }

  private transformEventForBigQuery(event: any): BigQueryEventData {
    const eventDate = new Date(event.createdAt);
    
    return {
      event_id: event.id,
      tenant_id: event.tenantId,
      event_type: event.eventType,
      event_version: event.eventVersion,
      source: event.source,
      data: event.data,
      metadata: event.metadata,
      status: event.status,
      processed_at: event.processedAt ? event.processedAt.toISOString() : null,
      error_message: event.errorMessage,
      created_at: event.createdAt.toISOString(),
      updated_at: event.updatedAt.toISOString(),
      event_date: eventDate.toISOString().split('T')[0],
      event_hour: eventDate.getHours(),
      event_day_of_week: eventDate.getDay(),
      event_month: eventDate.getMonth() + 1,
      event_year: eventDate.getFullYear()
    };
  }

  private async insertBatchIntoBigQuery(table: any, events: BigQueryEventData[]) {
    try {
      const [response] = await table.insert(events, {
        skipInvalidRows: false,
        ignoreUnknownValues: false
      });

      if (response.errors && response.errors.length > 0) {
        console.error('BigQuery insert errors:', response.errors);
        throw new Error(`BigQuery insert failed: ${JSON.stringify(response.errors)}`);
      }

      return response;
    } catch (error) {
      console.error('Error inserting batch into BigQuery:', error);
      throw error;
    }
  }

  private async markEventsAsExported(tenantId: string, startDate: string, endDate: string) {
    try {
      await this.prisma.webhookEvent.updateMany({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        data: {
          metadata: {
            exported_to_bigquery: true,
            exported_at: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error marking events as exported:', error);
      // Don't throw here as the main export was successful
    }
  }
}

// Daily export job
export class DailyBigQueryExportJob {
  private bigquery: BigQuery;
  private prisma: PrismaClient;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    this.prisma = new PrismaClient();
  }

  async process(job: Job) {
    try {
      console.log('Starting daily BigQuery export job');

      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const startDate = yesterday.toISOString().split('T')[0];
      const endDate = yesterday.toISOString().split('T')[0];

      // Get all tenants
      const tenants = await this.prisma.tenant.findMany({
        select: { id: true, name: true }
      });

      console.log(`Found ${tenants.length} tenants to export`);

      // Export events for each tenant
      for (const tenant of tenants) {
        try {
          const exportJob = new BigQueryExportJob();
          await exportJob.process({
            data: {
              tenantId: tenant.id,
              startDate,
              endDate,
              batchSize: 1000
            }
          } as Job<BigQueryExportJobData>);

          console.log(`Successfully exported events for tenant: ${tenant.name}`);
        } catch (error) {
          console.error(`Failed to export events for tenant ${tenant.name}:`, error);
          // Continue with other tenants
        }
      }

      console.log('Daily BigQuery export job completed');

    } catch (error) {
      console.error('Daily BigQuery export job failed:', error);
      throw error;
    }
  }
}

// Export orders and settlements to BigQuery
export class OrdersBigQueryExportJob {
  private bigquery: BigQuery;
  private prisma: PrismaClient;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    this.prisma = new PrismaClient();
  }

  async process(job: Job<BigQueryExportJobData>) {
    const { tenantId, startDate, endDate, batchSize = 1000 } = job.data;

    try {
      console.log(`Starting orders BigQuery export for tenant ${tenantId}`);

      const datasetId = process.env.BIGQUERY_DATASET_ID || 'tdc_analytics';
      const tableId = 'orders';

      const dataset = this.bigquery.dataset(datasetId);
      const table = dataset.table(tableId);

      // Ensure table exists
      await this.ensureOrdersTableExists(datasetId, tableId);

      // Export orders
      let offset = 0;
      let totalExported = 0;
      let hasMore = true;

      while (hasMore) {
        const orders = await this.getOrdersBatch(tenantId, startDate, endDate, offset, batchSize);
        
        if (orders.length === 0) {
          hasMore = false;
          break;
        }

        const bigQueryOrders = orders.map(order => this.transformOrderForBigQuery(order));
        await this.insertBatchIntoBigQuery(table, bigQueryOrders);

        totalExported += orders.length;
        offset += batchSize;

        console.log(`Exported ${orders.length} orders (total: ${totalExported})`);
      }

      console.log(`Orders BigQuery export completed. Total orders exported: ${totalExported}`);

    } catch (error) {
      console.error(`Orders BigQuery export failed for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  private async ensureOrdersTableExists(datasetId: string, tableId: string) {
    try {
      const dataset = this.bigquery.dataset(datasetId);
      const table = dataset.table(tableId);
      const [exists] = await table.exists();
      
      if (!exists) {
        console.log(`Creating BigQuery orders table: ${datasetId}.${tableId}`);
        
        const schema = [
          { name: 'order_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'tenant_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'customer_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'seller_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'status', type: 'STRING', mode: 'REQUIRED' },
          { name: 'total_amount', type: 'NUMERIC', mode: 'REQUIRED' },
          { name: 'commission_amount', type: 'NUMERIC', mode: 'REQUIRED' },
          { name: 'take_rate', type: 'NUMERIC', mode: 'REQUIRED' },
          { name: 'gmv', type: 'NUMERIC', mode: 'REQUIRED' },
          { name: 'currency', type: 'STRING', mode: 'REQUIRED' },
          { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'order_date', type: 'DATE', mode: 'REQUIRED' },
          { name: 'order_hour', type: 'INTEGER', mode: 'REQUIRED' },
          { name: 'order_day_of_week', type: 'INTEGER', mode: 'REQUIRED' },
          { name: 'order_month', type: 'INTEGER', mode: 'REQUIRED' },
          { name: 'order_year', type: 'INTEGER', mode: 'REQUIRED' }
        ];

        await table.create({
          schema,
          description: 'TDC Orders Data'
        });
      }
    } catch (error) {
      console.error('Error ensuring orders table exists:', error);
      throw error;
    }
  }

  private async getOrdersBatch(
    tenantId: string,
    startDate: string,
    endDate: string,
    offset: number = 0,
    limit: number = 1000
  ) {
    return this.prisma.order.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        orderItems: true,
        customer: true,
        seller: true
      },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit
    });
  }

  private transformOrderForBigQuery(order: any) {
    const orderDate = new Date(order.createdAt);
    const totalAmount = order.totalAmount || 0;
    const commissionAmount = order.commissionAmount || 0;
    const takeRate = totalAmount > 0 ? (commissionAmount / totalAmount) * 100 : 0;

    return {
      order_id: order.id,
      tenant_id: order.tenantId,
      customer_id: order.customerId,
      seller_id: order.sellerId,
      status: order.status,
      total_amount: totalAmount,
      commission_amount: commissionAmount,
      take_rate: takeRate,
      gmv: totalAmount,
      currency: order.currency || 'USD',
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
      order_date: orderDate.toISOString().split('T')[0],
      order_hour: orderDate.getHours(),
      order_day_of_week: orderDate.getDay(),
      order_month: orderDate.getMonth() + 1,
      order_year: orderDate.getFullYear()
    };
  }

  private async insertBatchIntoBigQuery(table: any, orders: any[]) {
    try {
      const [response] = await table.insert(orders, {
        skipInvalidRows: false,
        ignoreUnknownValues: false
      });

      if (response.errors && response.errors.length > 0) {
        console.error('BigQuery insert errors:', response.errors);
        throw new Error(`BigQuery insert failed: ${JSON.stringify(response.errors)}`);
      }

      return response;
    } catch (error) {
      console.error('Error inserting batch into BigQuery:', error);
      throw error;
    }
  }
}

// Workers
export function createBigQueryWorkers() {
  const eventsExportJob = new BigQueryExportJob();
  const dailyExportJob = new DailyBigQueryExportJob();
  const ordersExportJob = new OrdersBigQueryExportJob();

  return {
    bigqueryEventsWorker: new Worker('bigquery-events-export', async (job) => {
      await eventsExportJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 1,
      removeOnComplete: 10,
      removeOnFail: 5
    }),

    bigqueryDailyWorker: new Worker('bigquery-daily-export', async (job) => {
      await dailyExportJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 1,
      removeOnComplete: 30,
      removeOnFail: 10
    }),

    bigqueryOrdersWorker: new Worker('bigquery-orders-export', async (job) => {
      await ordersExportJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 1,
      removeOnComplete: 10,
      removeOnFail: 5
    })
  };
}

