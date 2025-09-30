import { prisma } from '../prisma-client.js';
import { Order, OrderItem, User, Seller, Product, ProductVariant, Prisma } from '@prisma/client';

export interface OrderWithRelations extends Order {
  customer: User;
  seller?: Seller | null;
  items: (OrderItem & {
    product: Product;
    variant?: ProductVariant | null;
  })[];
}

export class PrismaOrderRepository {
  async findById(id: string): Promise<OrderWithRelations | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderWithRelations | null> {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async findByCustomer(tenantId: string, customerId: string, limit = 20, offset = 0): Promise<OrderWithRelations[]> {
    return await prisma.order.findMany({
      where: { 
        tenantId,
        customerId,
      },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySeller(tenantId: string, sellerId: string, limit = 20, offset = 0): Promise<OrderWithRelations[]> {
    return await prisma.order.findMany({
      where: { 
        tenantId,
        sellerId,
      },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(tenantId: string, status: string, limit = 20, offset = 0): Promise<OrderWithRelations[]> {
    return await prisma.order.findMany({
      where: { 
        tenantId,
        status: status as any,
      },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<OrderWithRelations> {
    return await prisma.order.create({
      data,
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<OrderWithRelations> {
    return await prisma.order.update({
      where: { id },
      data,
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<OrderWithRelations> {
    return await prisma.order.update({
      where: { id },
      data: { 
        status: status as any,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }

  async count(tenantId: string): Promise<number> {
    return await prisma.order.count({
      where: { tenantId },
    });
  }

  async getSalesStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.OrderWhereInput = {
      tenantId,
      status: 'DELIVERED',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [totalOrders, totalRevenue, averageOrderValue] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where,
        _avg: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      averageOrderValue: averageOrderValue._avg.totalAmount || 0,
    };
  }

  async getOrdersByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<OrderWithRelations[]> {
    return await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

