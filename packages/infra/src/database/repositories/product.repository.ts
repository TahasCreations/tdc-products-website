import { prisma } from '../prisma-client.js';
import { Product, ProductVariant, Category, Seller, Prisma } from '@prisma/client';

export interface ProductWithRelations extends Product {
  category?: Category | null;
  seller: Seller;
  variants: ProductVariant[];
}

export class PrismaProductRepository {
  async findById(id: string): Promise<ProductWithRelations | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: true,
        variants: true,
      },
    });
  }

  async findBySlug(tenantId: string, slug: string): Promise<ProductWithRelations | null> {
    return await prisma.product.findFirst({
      where: { 
        tenantId,
        slug,
        isActive: true,
      },
      include: {
        category: true,
        seller: true,
        variants: true,
      },
    });
  }

  async findByCategory(tenantId: string, categoryId: string, limit = 20, offset = 0): Promise<ProductWithRelations[]> {
    return await prisma.product.findMany({
      where: { 
        tenantId,
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
        seller: true,
        variants: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySeller(tenantId: string, sellerId: string, limit = 20, offset = 0): Promise<ProductWithRelations[]> {
    return await prisma.product.findMany({
      where: { 
        tenantId,
        sellerId,
        isActive: true,
      },
      include: {
        category: true,
        seller: true,
        variants: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async search(tenantId: string, query: string, limit = 20, offset = 0): Promise<ProductWithRelations[]> {
    return await prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        seller: true,
        variants: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<ProductWithRelations> {
    return await prisma.product.create({
      data,
      include: {
        category: true,
        seller: true,
        variants: true,
      },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<ProductWithRelations> {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        seller: true,
        variants: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  async count(tenantId: string): Promise<number> {
    return await prisma.product.count({
      where: { tenantId, isActive: true },
    });
  }

  async findByTags(tenantId: string, tags: string[], limit = 20, offset = 0): Promise<ProductWithRelations[]> {
    return await prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
        tags: { hasSome: tags },
      },
      include: {
        category: true,
        seller: true,
        variants: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }
}

