import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

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
    emoji: '📱',
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
    emoji: '👕',
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
    emoji: '🏠',
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
    emoji: '⚽',
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
    emoji: '📚',
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
    emoji: '📱',
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
    emoji: '💻',
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
    emoji: '👔',
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
    emoji: '👗',
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
    emoji: '🪑',
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

    // Supabase'den kategorileri çek
    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    // Parent ID'ye göre filtreleme
    if (parentId !== null) {
      if (parentId === 'null' || parentId === '') {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }
    }

    // Level filtreleme
    if (level !== null) {
      // Level hesaplama - parent_id null ise level 0, değilse level 1
      if (level === '0') {
        query = query.is('parent_id', null);
      } else if (level === '1') {
        query = query.not('parent_id', 'is', null);
      }
    }

    // Aktif kategorileri filtreleme
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      // Fallback olarak mock data kullan
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
        data: filteredCategories,
        source: 'mock'
      });
    }

    // Supabase verilerini frontend formatına dönüştür
    const formattedData = data?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parent_id,
      level: cat.parent_id ? 1 : 0,
      isActive: cat.is_active,
      sortOrder: cat.sort_order,
      description: cat.description || '',
      image: cat.image_url || '',
      emoji: cat.emoji || '📦',
      createdAt: cat.created_at,
      updatedAt: cat.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: formattedData,
      source: 'supabase'
    });
  } catch (error) {
    console.error('API error:', error);
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
    const { action, id, name, slug, parentId, description, image, sortOrder, emoji } = body;

    // Handle delete action
    if (action === 'delete' && id) {
      // Supabase'den sil
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        
        // Fallback: Mock data'dan sil
        const categoryIndex = categories.findIndex(cat => cat.id === id);
        
        if (categoryIndex === -1) {
          return NextResponse.json({
            success: false,
            message: 'Category not found'
          }, { status: 404 });
        }

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
          message: 'Category deleted successfully (mock)'
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully'
      });
    }

    // Handle add/update actions
    if (action === 'add') {
      // Validation
      if (!name) {
        return NextResponse.json({
          success: false,
          message: 'Category name is required'
        }, { status: 400 });
      }

      // Generate slug from name
      const generatedSlug = name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Supabase'e ekle
      const { data: newCategoryData, error: insertError } = await supabase
        .from('categories')
        .insert([{
          name,
          slug: generatedSlug,
          parent_id: parentId || null,
          description: description || '',
          image_url: emoji || image || '📦',
          emoji: emoji || '📦',
          sort_order: sortOrder || 0,
          is_active: true
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        
        // Fallback: Mock data'ya ekle
        const existingCategory = categories.find(cat => cat.slug === generatedSlug);
        if (existingCategory) {
          return NextResponse.json({
            success: false,
            message: 'Category with this name already exists'
          }, { status: 400 });
        }

        const newCategory = {
          id: `cat-${Date.now()}`,
          name,
          slug: generatedSlug,
          parentId: parentId || null,
          level: parentId ? 1 : 0,
          isActive: true,
          sortOrder: sortOrder || categories.length + 1,
          description: description || '',
          image: emoji || image || '📦',
          emoji: emoji || '📦',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        categories.push(newCategory);

        return NextResponse.json({
          success: true,
          message: 'Category created successfully (mock)',
          data: newCategory
        });
      }

      // Supabase verisini frontend formatına dönüştür
      const formattedCategory = {
        id: newCategoryData.id,
        name: newCategoryData.name,
        slug: newCategoryData.slug,
        parentId: newCategoryData.parent_id,
        level: newCategoryData.parent_id ? 1 : 0,
        isActive: newCategoryData.is_active,
        sortOrder: newCategoryData.sort_order,
        description: newCategoryData.description || '',
        image: newCategoryData.image_url || '',
        emoji: newCategoryData.emoji || emoji || '📦',
        createdAt: newCategoryData.created_at,
        updatedAt: newCategoryData.updated_at
      };

      return NextResponse.json({
        success: true,
        message: 'Category created successfully',
        data: formattedCategory
      });
    }

    if (action === 'update' && id) {
      // Supabase'de güncelle
      const updateData: any = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (emoji || image) {
        updateData.image_url = emoji || image;
        updateData.emoji = emoji || '📦';
      }
      if (parentId !== undefined) updateData.parent_id = parentId;
      if (sortOrder !== undefined) updateData.sort_order = sortOrder;

      const { data: updatedCategoryData, error: updateError } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        
        // Fallback: Mock data'da güncelle
        const categoryIndex = categories.findIndex(cat => cat.id === id);
        if (categoryIndex === -1) {
          return NextResponse.json({
            success: false,
            message: 'Category not found'
          }, { status: 404 });
        }

        categories[categoryIndex] = {
          ...categories[categoryIndex],
          name: name || categories[categoryIndex].name,
          description: description || categories[categoryIndex].description,
          image: emoji || image || categories[categoryIndex].image,
          emoji: emoji || categories[categoryIndex].emoji || '📦',
          parentId: parentId !== undefined ? parentId : categories[categoryIndex].parentId,
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Category updated successfully (mock)',
          data: categories[categoryIndex]
        });
      }

      // Supabase verisini frontend formatına dönüştür
      const formattedCategory = {
        id: updatedCategoryData.id,
        name: updatedCategoryData.name,
        slug: updatedCategoryData.slug,
        parentId: updatedCategoryData.parent_id,
        level: updatedCategoryData.parent_id ? 1 : 0,
        isActive: updatedCategoryData.is_active,
        sortOrder: updatedCategoryData.sort_order,
        description: updatedCategoryData.description || '',
        image: updatedCategoryData.image_url || '',
        emoji: updatedCategoryData.emoji || emoji || '📦',
        createdAt: updatedCategoryData.created_at,
        updatedAt: updatedCategoryData.updated_at
      };

      return NextResponse.json({
        success: true,
        message: 'Category updated successfully',
        data: formattedCategory
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to process request',
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