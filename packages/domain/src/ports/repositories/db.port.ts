// Generic Database Port
export interface DbEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbQuery {
  where?: Record<string, any>;
  select?: Record<string, boolean> | string[];
  include?: Record<string, boolean>;
  orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
  take?: number;
  skip?: number;
}

export interface DbResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export interface DbTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  execute<T>(operation: (tx: DbTransaction) => Promise<T>): Promise<T>;
}

// Generic Database Port Interface
export interface DbPort {
  // Find one
  findOne<T extends DbEntity>(
    table: string, 
    query: DbQuery
  ): Promise<T | null>;
  
  // Find many
  findMany<T extends DbEntity>(
    table: string, 
    query: DbQuery
  ): Promise<DbResult<T>>;
  
  // Create
  create<T extends DbEntity>(
    table: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T>;
  
  // Create many
  createMany<T extends DbEntity>(
    table: string, 
    data: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T[]>;
  
  // Update
  update<T extends DbEntity>(
    table: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T>;
  
  // Update many
  updateMany<T extends DbEntity>(
    table: string, 
    query: DbQuery, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<number>;
  
  // Delete
  delete(table: string, id: string): Promise<boolean>;
  
  // Delete many
  deleteMany(table: string, query: DbQuery): Promise<number>;
  
  // Count
  count(table: string, query?: DbQuery): Promise<number>;
  
  // Transaction
  transaction<T>(operation: (tx: DbTransaction) => Promise<T>): Promise<T>;
  
  // Raw query
  rawQuery<T>(query: string, params?: any[]): Promise<T[]>;
  
  // Health check
  healthCheck(): Promise<boolean>;
  
  // Close connection
  close(): Promise<void>;
}



