import { NextRequest, NextResponse } from 'next/server';
import { fileStorageManager } from '../../../lib/file-storage-manager';

export const dynamic = 'force-dynamic';

// Kategorileri getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent_id');
    const search = searchParams.get('search');

    let categories = await fileStorageManager.getCategories();

    // Ana kategori filtresi
    if (parentId === 'null' || parentId === '') {
      categories = categories.filter(c => !c.parent_id);
    } else if (parentId) {
      categories = categories.filter(c => c.parent_id === parentId);
    }

    // Arama filtresi
    if (search) {
      const searchLower = search.toLowerCase();
      categories = categories.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sıralama (ana kategoriler önce, sonra alt kategoriler)
    categories.sort((a, b) => {
      if (!a.parent_id && b.parent_id) return -1;
      if (a.parent_id && !b.parent_id) return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kategoriler alınamadı' 
    }, { status: 500 });
  }
}

// Kategori oluştur/güncelle/sil
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...data } = body;

    if (action === 'add') {
      // Yeni kategori ekle
      const {
        name,
        description,
        emoji,
        parentId
      } = data;

      if (!name) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori adı gerekli' 
        }, { status: 400 });
      }

      // Aynı isimde kategori var mı kontrol et
      const existingCategories = await fileStorageManager.getCategories();
      const nameExists = existingCategories.some(c => 
        c.name.toLowerCase() === name.toLowerCase() && 
        c.parent_id === parentId
      );

      if (nameExists) {
        return NextResponse.json({ 
          success: false, 
          error: 'Bu isimde bir kategori zaten mevcut' 
        }, { status: 400 });
      }

      const newCategory = await fileStorageManager.addCategory({
        name: name.trim(),
        description: description || '',
        emoji: emoji || '📦',
        color: '#6b7280',
        icon: 'ri-more-line',
        parent_id: parentId || null,
        level: parentId ? 2 : 1
      });

      return NextResponse.json({
        success: true,
        category: newCategory,
        message: 'Kategori başarıyla eklendi'
      });

    } else if (action === 'update') {
      // Kategori güncelle
      if (!id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori ID gerekli' 
        }, { status: 400 });
      }

      const updatedCategory = await fileStorageManager.updateCategory(id, data);
      
      if (!updatedCategory) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori bulunamadı' 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        category: updatedCategory,
        message: 'Kategori başarıyla güncellendi'
      });

    } else if (action === 'delete') {
      // Kategori sil
      if (!id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori ID gerekli' 
        }, { status: 400 });
      }

      try {
        const deleted = await fileStorageManager.deleteCategory(id);
        
        if (!deleted) {
          return NextResponse.json({ 
            success: false, 
            error: 'Kategori bulunamadı' 
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: 'Kategori başarıyla silindi'
        });
      } catch (deleteError) {
        return NextResponse.json({ 
          success: false, 
          error: deleteError instanceof Error ? deleteError.message : 'Kategori silinemedi' 
        }, { status: 400 });
      }

    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz işlem' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Category operation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Kategori güncelle (PUT method)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kategori ID gerekli' 
      }, { status: 400 });
    }

    const updatedCategory = await fileStorageManager.updateCategory(id, updateData);
    
    if (!updatedCategory) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kategori bulunamadı' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: 'Kategori başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Kategori sil (DELETE method)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kategori ID gerekli' 
      }, { status: 400 });
    }

    try {
      const deleted = await fileStorageManager.deleteCategory(id);
      
      if (!deleted) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori bulunamadı' 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Kategori başarıyla silindi'
      });
    } catch (deleteError) {
      return NextResponse.json({ 
        success: false, 
        error: deleteError instanceof Error ? deleteError.message : 'Kategori silinemedi' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}