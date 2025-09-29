import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/categories - Kategorileri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const parentId = searchParams.get('parentId');
    const withProducts = searchParams.get('withProducts') === 'true';
    
    // Build where clause
    const where: any = {};
    
    if (!includeInactive) {
      where.isActive = true;
    }
    
    if (parentId) {
      if (parentId === 'null') {
        where.parentId = null;
      } else {
        where.parentId = parentId;
      }
    }
    
    // Build include clause
    const include: any = {
      parent: true,
      children: true,
      _count: {
        select: {
          products: withProducts ? undefined : true
        }
      }
    };
    
    if (withProducts) {
      include.products = {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          price: true,
          images: true
        },
        take: 10
      };
    }
    
    const categories = await prisma.category.findMany({
      where,
      include,
      orderBy: [
        { name: 'asc' }
      ]
    });
    
    return NextResponse.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Yeni kategori oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Kategori adı gereklidir' },
        { status: 400 }
      );
    }
    
    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu kategori adı zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    // Create category
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: slug,
        description: body.description,
        parentId: body.parentId || null,
        imageUrl: body.imageUrl,
        icon: body.icon,
        emoji: body.emoji,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== false,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords || [],
        metadata: body.metadata || {}
      },
      include: {
        parent: true,
        children: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla oluşturuldu',
      data: category
    });
    
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Kategori oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
