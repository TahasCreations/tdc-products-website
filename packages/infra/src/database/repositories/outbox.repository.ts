import { prisma } from '../prisma-client.js';
import { EventOutbox, Prisma } from '@prisma/client';

export class PrismaOutboxRepository {
  async create(data: Prisma.EventOutboxCreateInput): Promise<EventOutbox> {
    return await prisma.eventOutbox.create({
      data,
    });
  }

  async findUnprocessed(limit = 100): Promise<EventOutbox[]> {
    return await prisma.eventOutbox.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async markAsProcessed(id: string): Promise<void> {
    await prisma.eventOutbox.update({
      where: { id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });
  }

  async markAsFailed(id: string, error: string): Promise<void> {
    await prisma.eventOutbox.update({
      where: { id },
      data: {
        retryCount: { increment: 1 },
        lastError: error,
      },
    });
  }

  async deleteProcessed(olderThanDays = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.eventOutbox.deleteMany({
      where: {
        processed: true,
        processedAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }

  async getStats() {
    const [total, processed, pending, failed] = await Promise.all([
      prisma.eventOutbox.count(),
      prisma.eventOutbox.count({ where: { processed: true } }),
      prisma.eventOutbox.count({ where: { processed: false } }),
      prisma.eventOutbox.count({ 
        where: { 
          processed: false,
          retryCount: { gt: 0 },
        },
      }),
    ]);

    return {
      total,
      processed,
      pending,
      failed,
    };
  }

  async findByAggregate(aggregateType: string, aggregateId: string): Promise<EventOutbox[]> {
    return await prisma.eventOutbox.findMany({
      where: {
        aggregateType,
        aggregateId,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByEventType(eventType: string, limit = 100): Promise<EventOutbox[]> {
    return await prisma.eventOutbox.findMany({
      where: { eventType },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRetryableEvents(maxRetries = 3): Promise<EventOutbox[]> {
    return await prisma.eventOutbox.findMany({
      where: {
        processed: false,
        retryCount: { lt: maxRetries },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async bulkCreate(events: Prisma.EventOutboxCreateInput[]): Promise<EventOutbox[]> {
    return await prisma.$transaction(
      events.map(event => prisma.eventOutbox.create({ data: event }))
    );
  }

  async bulkMarkAsProcessed(ids: string[]): Promise<void> {
    await prisma.eventOutbox.updateMany({
      where: { id: { in: ids } },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });
  }
}

