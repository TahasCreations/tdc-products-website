#!/usr/bin/env tsx

/**
 * Database Seed Script
 * 
 * This script seeds the database with initial data for development
 * Run with: pnpm db:seed
 */

import { prisma } from './prisma-client.js';
import { env } from '@tdc/config';

async function main() {
  console.log('🌱 Starting database seed...');

  // Validate environment
  if (!env.isDevelopment()) {
    console.log('⚠️  This script should only be run in development mode');
    process.exit(1);
  }

  try {
    // Create default tenant
    const tenant = await prisma.tenant.upsert({
      where: { slug: 'tdc-market' },
      update: {},
      create: {
        name: 'TDC Market',
        slug: 'tdc-market',
        domain: 'localhost:3000',
        isActive: true,
        settings: {
          currency: 'TRY',
          timezone: 'Europe/Istanbul',
          language: 'tr',
        },
      },
    });

    console.log('✅ Created tenant:', tenant.name);

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { 
        tenantId_email: {
          tenantId: tenant.id,
          email: 'admin@tdcmarket.com',
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'admin@tdcmarket.com',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create test seller
    const seller = await prisma.seller.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        tenantId: tenant.id,
        userId: adminUser.id,
        businessName: 'TDC 3D Printing',
        businessType: 'COMPANY',
        taxNumber: '1234567890',
        bankAccount: 'TR1234567890123456789012345',
        commissionRate: 7.0,
        isActive: true,
        isVerified: true,
      },
    });

    console.log('✅ Created seller:', seller.businessName);

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { 
          tenantId_slug: {
            tenantId: tenant.id,
            slug: 'anime-figures',
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          name: 'Anime Figürler',
          slug: 'anime-figures',
          description: 'Anime karakterlerinin 3D baskı figürleri',
          isActive: true,
          sortOrder: 1,
        },
      }),
      prisma.category.upsert({
        where: { 
          tenantId_slug: {
            tenantId: tenant.id,
            slug: 'game-characters',
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          name: 'Oyun Karakterleri',
          slug: 'game-characters',
          description: 'Oyun karakterlerinin 3D baskı figürleri',
          isActive: true,
          sortOrder: 2,
        },
      }),
      prisma.category.upsert({
        where: { 
          tenantId_slug: {
            tenantId: tenant.id,
            slug: 'movie-characters',
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          name: 'Film Karakterleri',
          slug: 'movie-characters',
          description: 'Film karakterlerinin 3D baskı figürleri',
          isActive: true,
          sortOrder: 3,
        },
      }),
    ]);

    console.log('✅ Created categories:', categories.length);

    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          tenantId: tenant.id,
          sellerId: seller.id,
          categoryId: categories[0].id,
          name: 'Naruto Uzumaki Figür',
          slug: 'naruto-uzumaki-figur',
          description: 'Naruto anime serisinin ana karakteri Naruto Uzumaki\'nin detaylı 3D baskı figürü.',
          shortDescription: 'Naruto Uzumaki 3D Figür',
          sku: 'NAR-001',
          brand: 'TDC 3D',
          model: 'Naruto Uzumaki',
          weight: 250,
          dimensions: { length: 15, width: 10, height: 25 },
          images: ['https://example.com/naruto-1.jpg', 'https://example.com/naruto-2.jpg'],
          tags: ['anime', 'naruto', 'uzumaki', '3d', 'figur'],
          isActive: true,
          price: 150.00,
        },
      }),
      prisma.product.create({
        data: {
          tenantId: tenant.id,
          sellerId: seller.id,
          categoryId: categories[1].id,
          name: 'Mario Figür',
          slug: 'mario-figur',
          description: 'Super Mario oyununun ikonik karakteri Mario\'nun renkli 3D baskı figürü.',
          shortDescription: 'Mario 3D Figür',
          sku: 'MAR-001',
          brand: 'TDC 3D',
          model: 'Mario',
          weight: 200,
          dimensions: { length: 12, width: 8, height: 20 },
          images: ['https://example.com/mario-1.jpg'],
          tags: ['game', 'mario', 'nintendo', '3d', 'figur'],
          isActive: true,
          price: 120.00,
        },
      }),
    ]);

    console.log('✅ Created products:', products.length);

    // Create product variants
    for (const product of products) {
      await prisma.productVariant.createMany({
        data: [
          {
            productId: product.id,
            name: 'Küçük Boy',
            sku: `${product.sku}-S`,
            attributes: { size: 'small', color: 'default' },
            price: product.price * 0.8,
            isActive: true,
          },
          {
            productId: product.id,
            name: 'Orta Boy',
            sku: `${product.sku}-M`,
            attributes: { size: 'medium', color: 'default' },
            price: product.price,
            isActive: true,
          },
          {
            productId: product.id,
            name: 'Büyük Boy',
            sku: `${product.sku}-L`,
            attributes: { size: 'large', color: 'default' },
            price: product.price * 1.2,
            isActive: true,
          },
        ],
      });
    }

    console.log('✅ Created product variants');

    // Create inventory
    for (const product of products) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          quantity: 100,
          reserved: 0,
          available: 100,
          minQuantity: 10,
          maxQuantity: 500,
          location: 'Ana Depo',
        },
      });
    }

    console.log('✅ Created inventory records');

    // Create commission rules
    await prisma.commissionRule.createMany({
      data: [
        {
          tenantId: tenant.id,
          businessType: 'INDIVIDUAL',
          minAmount: 0,
          rate: 7.0,
          taxRate: 18.0,
          isActive: true,
        },
        {
          tenantId: tenant.id,
          businessType: 'COMPANY',
          minAmount: 0,
          rate: 10.0,
          taxRate: 18.0,
          isActive: true,
        },
        {
          tenantId: tenant.id,
          businessType: 'CORPORATE',
          minAmount: 10000,
          rate: 5.0,
          taxRate: 18.0,
          isActive: true,
        },
      ],
    });

    console.log('✅ Created commission rules');

    // Create sample outbox events
    await prisma.eventOutbox.createMany({
      data: [
        {
          aggregateId: tenant.id,
          aggregateType: 'Tenant',
          eventType: 'TenantCreated',
          eventVersion: 1,
          payload: {
            tenantId: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
          },
          processed: true,
          processedAt: new Date(),
        },
        {
          aggregateId: adminUser.id,
          aggregateType: 'User',
          eventType: 'UserCreated',
          eventVersion: 1,
          payload: {
            userId: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
          },
          processed: true,
          processedAt: new Date(),
        },
      ],
    });

    console.log('✅ Created sample outbox events');

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Tenant: ${tenant.name} (${tenant.slug})`);
    console.log(`   - Admin User: ${adminUser.email}`);
    console.log(`   - Seller: ${seller.businessName}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Commission Rules: 3`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });

