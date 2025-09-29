import { Pool, PoolClient } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

class DatabaseManager {
  private pool: Pool;
  private static instance: DatabaseManager;

  constructor() {
    const config: DatabaseConfig = {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'tdc_database',
      user: process.env.POSTGRES_USER || 'tdc_user',
      password: process.env.POSTGRES_PASSWORD || 'tdc_password',
      ssl: process.env.NODE_ENV === 'production'
    };

    this.pool = new Pool({
      ...config,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    console.log('🗄️ Database connection pool initialized');
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`🔍 Database query executed in ${duration}ms:`, text.substring(0, 100));
      return result;
    } catch (error) {
      console.error('❌ Database query error:', error);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('🗄️ Database connection pool closed');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }

  // Migration helper
  async runMigrations(): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await this.query(schema);
        console.log('✅ Database schema migrated successfully');
      }
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

export default DatabaseManager.getInstance();
