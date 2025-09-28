import { NextRequest, NextResponse } from 'next/server';
import { hybridStorageManager } from '../../../../lib/hybrid-storage-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent_id');
    const search = searchParams.get('search');

    let categories = await hybridStorageManager.getCategories();

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

    // Sıralama
    categories.sort((a, b) => {
      if (!a.parent_id && b.parent_id) return -1;
      if (a.parent_id && !b.parent_id) return 1;
      return a.name.localeCompare(b.name);
    });

    const syncStatus = hybridStorageManager.getSyncStatus();

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
      syncStatus,
      isHybrid: true
    });

  } catch (error) {
    console.error('Hybrid get categories error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kategoriler alınamadı' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...data } = body;

    if (action === 'add') {
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
      const existingCategories = await hybridStorageManager.getCategories();
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

      const newCategory = await hybridStorageManager.addCategory({
        name: name.trim(),
        description: description || '',
        emoji: emoji || '📦',
        color: '#6b7280',
        icon: 'ri-more-line',
        parent_id: parentId || null,
        level: parentId ? 2 : 1
      });

      const syncStatus = hybridStorageManager.getSyncStatus();

      return NextResponse.json({
        success: true,
        category: newCategory,
        message: 'Kategori başarıyla eklendi (Local + Cloud)',
        syncStatus
      });

    } else if (action === 'update') {
      if (!id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori ID gerekli' 
        }, { status: 400 });
      }

      const updatedCategory = await hybridStorageManager.updateCategory(id, data);
      
      if (!updatedCategory) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori bulunamadı' 
        }, { status: 404 });
      }

      const syncStatus = hybridStorageManager.getSyncStatus();

      return NextResponse.json({
        success: true,
        category: updatedCategory,
        message: 'Kategori başarıyla güncellendi (Local + Cloud)',
        syncStatus
      });

    } else if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kategori ID gerekli' 
        }, { status: 400 });
      }

      try {
        const deleted = await hybridStorageManager.deleteCategory(id);
        
        if (!deleted) {
          return NextResponse.json({ 
            success: false, 
            error: 'Kategori bulunamadı' 
          }, { status: 404 });
        }

        const syncStatus = hybridStorageManager.getSyncStatus();

        return NextResponse.json({
          success: true,
          message: 'Kategori başarıyla silindi (Local + Cloud)',
          syncStatus
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
    console.error('Hybrid category operation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Sunucu hatası' 
    }, { status: 500 });
  }
}
