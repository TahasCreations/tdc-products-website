import { 
  DbPort, 
  DbEntity, 
  DbQuery, 
  DbResult, 
  DbTransaction 
} from '@tdc/domain';
import { prisma } from './prisma-client.js';

export class PrismaAdapter implements DbPort {
  private readonly prisma: typeof prisma;

  constructor(prismaInstance?: typeof prisma) {
    this.prisma = prismaInstance || prisma;
  }

  async findOne<T extends DbEntity>(table: string, query: DbQuery): Promise<T | null> {
    try {
      const result = await (this.prisma as any)[table].findFirst({
        where: query.where,
        select: query.select,
        include: query.include,
        orderBy: query.orderBy,
      });

      return result as T | null;
    } catch (error) {
      throw new Error(`Database findOne failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findMany<T extends DbEntity>(table: string, query: DbQuery): Promise<DbResult<T>> {
    try {
      const [data, total] = await Promise.all([
        (this.prisma as any)[table].findMany({
          where: query.where,
          select: query.select,
          include: query.include,
          orderBy: query.orderBy,
          take: query.take,
          skip: query.skip,
        }),
        (this.prisma as any)[table].count({
          where: query.where,
        })
      ]);

      return {
        data: data as T[],
        total,
        hasMore: query.take ? data.length === query.take : false
      };
    } catch (error) {
      throw new Error(`Database findMany failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create<T extends DbEntity>(
    table: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T> {
    try {
      const result = await (this.prisma as any)[table].create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      return result as T;
    } catch (error) {
      throw new Error(`Database create failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createMany<T extends DbEntity>(
    table: string, 
    data: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T[]> {
    try {
      const dataWithTimestamps = data.map(item => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await (this.prisma as any)[table].createMany({
        data: dataWithTimestamps,
        skipDuplicates: true,
      });

      // Return the created records (Prisma createMany doesn't return the records)
      // This is a limitation, in real implementation you might want to handle this differently
      return [] as T[];
    } catch (error) {
      throw new Error(`Database createMany failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update<T extends DbEntity>(
    table: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T> {
    try {
      const result = await (this.prisma as any)[table].update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        }
      });

      return result as T;
    } catch (error) {
      throw new Error(`Database update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateMany<T extends DbEntity>(
    table: string, 
    query: DbQuery, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<number> {
    try {
      const result = await (this.prisma as any)[table].updateMany({
        where: query.where,
        data: {
          ...data,
          updatedAt: new Date(),
        }
      });

      return result.count;
    } catch (error) {
      throw new Error(`Database updateMany failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(table: string, id: string): Promise<boolean> {
    try {
      await (this.prisma as any)[table].delete({
        where: { id }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteMany(table: string, query: DbQuery): Promise<number> {
    try {
      const result = await (this.prisma as any)[table].deleteMany({
        where: query.where
      });

      return result.count;
    } catch (error) {
      throw new Error(`Database deleteMany failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async count(table: string, query?: DbQuery): Promise<number> {
    try {
      const result = await (this.prisma as any)[table].count({
        where: query?.where
      });

      return result;
    } catch (error) {
      throw new Error(`Database count failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async transaction<T>(operation: (tx: DbTransaction) => Promise<T>): Promise<T> {
    try {
      return await this.prisma.$transaction(async (prismaTx) => {
        const tx = new PrismaTransaction(prismaTx);
        return await operation(tx);
      });
    } catch (error) {
      throw new Error(`Database transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async rawQuery<T>(query: string, params?: any[]): Promise<T[]> {
    try {
      const result = await this.prisma.$queryRawUnsafe(query, ...(params || []));
      return result as T[];
    } catch (error) {
      throw new Error(`Database raw query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

class PrismaTransaction implements DbTransaction {
  constructor(private prismaTx: any) {}

  async commit(): Promise<void> {
    // Prisma transactions are auto-committed
  }

  async rollback(): Promise<void> {
    // Prisma transactions are auto-rolled back on error
    throw new Error('Transaction rollback');
  }

  async execute<T>(operation: (tx: DbTransaction) => Promise<T>): Promise<T> {
    return await operation(this);
  }

  // Implement the same methods as PrismaAdapter but using this.prismaTx
  async findOne<T extends DbEntity>(table: string, query: DbQuery): Promise<T | null> {
    const result = await this.prismaTx[table].findFirst({
      where: query.where,
      select: query.select,
      include: query.include,
      orderBy: query.orderBy,
    });
    return result as T | null;
  }

  async findMany<T extends DbEntity>(table: string, query: DbQuery): Promise<DbResult<T>> {
    const [data, total] = await Promise.all([
      this.prismaTx[table].findMany({
        where: query.where,
        select: query.select,
        include: query.include,
        orderBy: query.orderBy,
        take: query.take,
        skip: query.skip,
      }),
      this.prismaTx[table].count({
        where: query.where,
      })
    ]);

    return {
      data: data as T[],
      total,
      hasMore: query.take ? data.length === query.take : false
    };
  }

  async create<T extends DbEntity>(
    table: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T> {
    const result = await this.prismaTx[table].create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    return result as T;
  }

  async update<T extends DbEntity>(
    table: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T> {
    const result = await this.prismaTx[table].update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
    return result as T;
  }

  async delete(table: string, id: string): Promise<boolean> {
    await this.prismaTx[table].delete({
      where: { id }
    });
    return true;
  }
}
