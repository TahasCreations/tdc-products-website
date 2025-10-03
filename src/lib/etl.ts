import "server-only";

import { getStorage, getBigQuery } from './gcp';
import { prisma } from './prisma';

export async function exportAnalyticsToBQ({ date = new Date() } = {}) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const bucketName = process.env.GCS_EXPORT_BUCKET;
  const datasetId = process.env.BQ_DATASET || 'tdc_analytics';

  if (!bucketName) {
    throw new Error('GCS_EXPORT_BUCKET environment variable is required');
  }

  const storage = getStorage();
  const bigquery = getBigQuery();

  try {
    // 1. Fetch data from Prisma
    const [ledgerEntries, adClicks, subscriptions] = await Promise.all([
      prisma.ledgerEntry.findMany({
        select: {
          id: true,
          sellerId: true,
          type: true,
          amount: true,
          currency: true,
          meta: true,
          createdAt: true,
        },
      }),
      prisma.adClick.findMany({
        select: {
          id: true,
          campaignId: true,
          productId: true,
          cost: true,
          ip: true,
          ua: true,
          createdAt: true,
        },
      }),
      prisma.subscription.findMany({
        select: {
          id: true,
          sellerId: true,
          plan: true,
          status: true,
          billingCycle: true,
          price: true,
          currency: true,
          periodStart: true,
          periodEnd: true,
        },
      }),
    ]);

    // 2. Convert to NDJSON
    const ledgerNDJSON = ledgerEntries.map(entry => JSON.stringify(entry)).join('\n');
    const adClicksNDJSON = adClicks.map(click => JSON.stringify(click)).join('\n');
    const subscriptionsNDJSON = subscriptions.map(sub => JSON.stringify(sub)).join('\n');

    // 3. Upload to GCS
    const bucket = storage.bucket(bucketName);
    const basePath = `etl/${dateStr}`;

    const [ledgerFile, adClicksFile, subscriptionsFile] = await Promise.all([
      bucket.file(`${basePath}/ledger.ndjson`).save(ledgerNDJSON),
      bucket.file(`${basePath}/adclicks.ndjson`).save(adClicksNDJSON),
      bucket.file(`${basePath}/subscriptions.ndjson`).save(subscriptionsNDJSON),
    ]);

    // 4. Ensure dataset exists
    const dataset = bigquery.dataset(datasetId);
    try {
      await dataset.get();
    } catch (error) {
      console.log(`Creating dataset ${datasetId}`);
      await dataset.create();
    }

    // 5. Define table schemas
    const ledgerSchema = [
      { name: 'id', type: 'STRING' },
      { name: 'sellerId', type: 'STRING' },
      { name: 'type', type: 'STRING' },
      { name: 'amount', type: 'NUMERIC' },
      { name: 'currency', type: 'STRING' },
      { name: 'meta', type: 'JSON' },
      { name: 'createdAt', type: 'TIMESTAMP' },
    ];

    const adClicksSchema = [
      { name: 'id', type: 'STRING' },
      { name: 'campaignId', type: 'STRING' },
      { name: 'productId', type: 'STRING' },
      { name: 'cost', type: 'NUMERIC' },
      { name: 'ip', type: 'STRING' },
      { name: 'ua', type: 'STRING' },
      { name: 'createdAt', type: 'TIMESTAMP' },
    ];

    const subscriptionsSchema = [
      { name: 'id', type: 'STRING' },
      { name: 'sellerId', type: 'STRING' },
      { name: 'plan', type: 'STRING' },
      { name: 'status', type: 'STRING' },
      { name: 'billingCycle', type: 'STRING' },
      { name: 'price', type: 'NUMERIC' },
      { name: 'currency', type: 'STRING' },
      { name: 'periodStart', type: 'TIMESTAMP' },
      { name: 'periodEnd', type: 'TIMESTAMP' },
    ];

    // 6. Create tables and load data
    const jobIds = await Promise.all([
      loadTableData(bigquery, datasetId, 'ledger_entries', ledgerSchema, `gs://${bucketName}/${basePath}/ledger.ndjson`),
      loadTableData(bigquery, datasetId, 'ad_clicks', adClicksSchema, `gs://${bucketName}/${basePath}/adclicks.ndjson`),
      loadTableData(bigquery, datasetId, 'subscriptions', subscriptionsSchema, `gs://${bucketName}/${basePath}/subscriptions.ndjson`),
    ]);

    return {
      success: true,
      date: dateStr,
      files: {
        ledger: `gs://${bucketName}/${basePath}/ledger.ndjson`,
        adClicks: `gs://${bucketName}/${basePath}/adclicks.ndjson`,
        subscriptions: `gs://${bucketName}/${basePath}/subscriptions.ndjson`,
      },
      jobIds: {
        ledger: jobIds[0],
        adClicks: jobIds[1],
        subscriptions: jobIds[2],
      },
    };
  } catch (error) {
    console.error('ETL export failed:', error);
    throw error;
  }
}

async function loadTableData(bigquery: any, datasetId: string, tableName: string, schema: any[], sourceUri: string): Promise<string> {
  const table = bigquery.dataset(datasetId).table(tableName);
  
  // Create table if it doesn't exist
  try {
    await table.get();
  } catch (error) {
    console.log(`Creating table ${tableName}`);
    await table.create({ schema });
  }

  // Load data
  const job = await table.load({
    sourceFormat: 'NEWLINE_DELIMITED_JSON',
    sourceUris: [sourceUri],
    schema: { fields: schema },
    writeDisposition: 'WRITE_TRUNCATE', // Replace existing data
  });

  return job[0].id;
}
