import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products - Ürünleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const seller = searchParams.get('seller');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status') || 'active';
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where: any = {
      status: status.toUpperCase(),
      visibility: 'PUBLIC'
    };
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { seoKeywords: { has: search } }
      ];
    }
    
    // Add category filter
    if (category) {
      where.category = {
        slug: category
      };
    }
    
    // Add seller filter
    if (seller) {
      where.seller = {
        businessName: { contains: seller, mode: 'insensitive' }
      };
    }
    
    // Add price filters
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    // Execute query
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          // seller: {
          //   select: {
          //     id: true,
          //     businessName: true,
          //     averageRating: true,
          //     totalReviews: true
          //   }
          // },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          // variants: {
          //   where: { isActive: true },
          //   select: {
          //     id: true,
          //     name: true,
          //     price: true,
          //     stockQuantity: true,
          //     imageUrl: true
          //   }
          // },
          // _count: {
          //   select: {
          //     reviews: true,
          //     wishlists: true
          //   }
          // }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.product.count({ where })
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/products - Yeni ürün oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'categoryId', 'sellerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} alanı gereklidir` },
          { status: 400 }
        );
      }
    }
    
    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: slug,
        description: body.description,
        shortDescription: body.shortDescription,
        sku: body.sku,
        brand: body.brand,
        model: body.model,
        price: parseFloat(body.price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        costPrice: body.costPrice ? parseFloat(body.costPrice) : null,
        currency: body.currency || 'TRY',
        stockQuantity: parseInt(body.stockQuantity) || 0,
        lowStockThreshold: parseInt(body.lowStockThreshold) || 5,
        trackInventory: body.trackInventory !== false,
        allowBackorder: body.allowBackorder || false,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions || null,
        images: body.images || [],
        videos: body.videos || [],
        documents: body.documents || [],
        status: body.status || 'DRAFT',
        visibility: body.visibility || 'PUBLIC',
        isFeatured: body.isFeatured || false,
        isDigital: body.isDigital || false,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords || [],
        sellerId: body.sellerId,
        categoryId: body.categoryId,
        metadata: body.metadata || {}
      },
      include: {
        seller: {
          select: {
            id: true,
            businessName: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: product
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Ürün oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
