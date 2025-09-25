import { NextRequest, NextResponse } from 'next/server';

// Mock kategori verileri - dinamik olarak güncellenebilir
let categories = [
  {
    id: 'cat-1',
    name: 'Elektronik',
    slug: 'elektronik',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 1,
    description: 'Elektronik ürünler ve aksesuarlar',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8bdd19ceab?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-2',
    name: 'Giyim',
    slug: 'giyim',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 2,
    description: 'Giyim ve aksesuar ürünleri',
    image: 'https://images.unsplash.com/photo-1483985988355-f7dc55c96655?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-3',
    name: 'Ev & Yaşam',
    slug: 'ev-yasam',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 3,
    description: 'Ev ve yaşam ürünleri',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-4',
    name: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 4,
    description: 'Spor ve outdoor ürünleri',
    image: '/images/categories/sports.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-5',
    name: 'Kitap & Hobi',
    slug: 'kitap-hobi',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 5,
    description: 'Kitap ve hobi ürünleri',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Alt kategoriler
  {
    id: 'sub-1-1',
    name: 'Telefon & Aksesuar',
    slug: 'telefon-aksesuar',
    parentId: 'cat-1',
    level: 1,
    isActive: true,
    sortOrder: 1,
    description: 'Telefon ve aksesuarları',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sub-1-2',
    name: 'Bilgisayar & Tablet',
    slug: 'bilgisayar-tablet',
    parentId: 'cat-1',
    level: 1,
    isActive: true,
    sortOrder: 2,
    description: 'Bilgisayar ve tablet ürünleri',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sub-2-1',
    name: 'Erkek Giyim',
    slug: 'erkek-giyim',
    parentId: 'cat-2',
    level: 1,
    isActive: true,
    sortOrder: 1,
    description: 'Erkek giyim ürünleri',
    image: 'https://images.unsplash.com/photo-1527719327867-f650ed16062b?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sub-2-2',
    name: 'Kadın Giyim',
    slug: 'kadin-giyim',
    parentId: 'cat-2',
    level: 1,
    isActive: true,
    sortOrder: 2,
    description: 'Kadın giyim ürünleri',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c5d84?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sub-3-1',
    name: 'Mobilya',
    slug: 'mobilya',
    parentId: 'cat-3',
    level: 1,
    isActive: true,
    sortOrder: 1,
    description: 'Mobilya ürünleri',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const level = searchParams.get('level');
    const isActive = searchParams.get('isActive');

    let filteredCategories = categories;

    if (parentId !== null) {
      filteredCategories = filteredCategories.filter(cat => cat.parentId === parentId);
    }

    if (level !== null) {
      filteredCategories = filteredCategories.filter(cat => cat.level === parseInt(level));
    }

    if (isActive !== null) {
      filteredCategories = filteredCategories.filter(cat => cat.isActive === (isActive === 'true'));
    }

    return NextResponse.json({
      success: true,
      data: filteredCategories
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, parentId, description, image, sortOrder } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json({
        success: false,
        message: 'Name and slug are required'
      }, { status: 400 });
    }

    // Check if slug already exists
    const existingCategory = categories.find(cat => cat.slug === slug);
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: 'Category with this slug already exists'
      }, { status: 400 });
    }

    // Create new category
    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      parentId: parentId || null,
      level: parentId ? 1 : 0,
      isActive: true,
      sortOrder: sortOrder || categories.length + 1,
      description: description || '',
      image: image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    categories.push(newCategory);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, parentId, description, image, sortOrder, isActive } = body;

    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }

    // Update category
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name || categories[categoryIndex].name,
      slug: slug || categories[categoryIndex].slug,
      parentId: parentId !== undefined ? parentId : categories[categoryIndex].parentId,
      level: parentId ? 1 : 0,
      description: description !== undefined ? description : categories[categoryIndex].description,
      image: image !== undefined ? image : categories[categoryIndex].image,
      sortOrder: sortOrder !== undefined ? sortOrder : categories[categoryIndex].sortOrder,
      isActive: isActive !== undefined ? isActive : categories[categoryIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: categories[categoryIndex]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Category ID is required'
      }, { status: 400 });
    }

    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }

    // Check if category has subcategories
    const hasSubcategories = categories.some(cat => cat.parentId === id);
    if (hasSubcategories) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete category with subcategories'
      }, { status: 400 });
    }

    categories.splice(categoryIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}