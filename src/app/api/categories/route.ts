import { NextRequest, NextResponse } from 'next/server';

// Mock kategori verileri
const categories = [
  {
    id: 1,
    name: 'Elektronik',
    slug: 'elektronik',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 1,
    description: 'Elektronik ürünler ve aksesuarlar',
    image: '/images/categories/electronics.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Giyim',
    slug: 'giyim',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 2,
    description: 'Giyim ve aksesuar ürünleri',
    image: '/images/categories/clothing.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Ev & Yaşam',
    slug: 'ev-yasam',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 3,
    description: 'Ev ve yaşam ürünleri',
    image: '/images/categories/home.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
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
    id: 5,
    name: 'Kitap & Hobi',
    slug: 'kitap-hobi',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 5,
    description: 'Kitap ve hobi ürünleri',
    image: '/images/categories/books.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Alt kategoriler
  {
    id: 6,
    name: 'Telefon & Aksesuar',
    slug: 'telefon-aksesuar',
    parentId: 1,
    level: 1,
    isActive: true,
    sortOrder: 1,
    description: 'Telefon ve aksesuarları',
    image: '/images/categories/phones.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    name: 'Bilgisayar & Tablet',
    slug: 'bilgisayar-tablet',
    parentId: 1,
    level: 1,
    isActive: true,
    sortOrder: 2,
    description: 'Bilgisayar ve tablet ürünleri',
    image: '/images/categories/computers.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    name: 'Erkek Giyim',
    slug: 'erkek-giyim',
    parentId: 2,
    level: 1,
    isActive: true,
    sortOrder: 1,
    description: 'Erkek giyim ürünleri',
    image: '/images/categories/mens-clothing.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 9,
    name: 'Kadın Giyim',
    slug: 'kadin-giyim',
    parentId: 2,
    level: 1,
    isActive: true,
    sortOrder: 2,
    description: 'Kadın giyim ürünleri',
    image: '/images/categories/womens-clothing.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 10,
    name: 'Mobilya',
    slug: 'mobilya',
    parentId: 3,
    level: 1,
    isActive: true,
    sortOrder: 1,
    description: 'Mobilya ürünleri',
    image: '/images/categories/furniture.jpg',
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
      filteredCategories = filteredCategories.filter(cat => cat.parentId === parseInt(parentId));
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
      id: categories.length + 1,
      name,
      slug,
      parentId: parentId ? parseInt(parentId) : null,
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

    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(id));
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
      parentId: parentId !== undefined ? (parentId ? parseInt(parentId) : null) : categories[categoryIndex].parentId,
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

    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(id));
    if (categoryIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }

    // Check if category has subcategories
    const hasSubcategories = categories.some(cat => cat.parentId === parseInt(id));
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