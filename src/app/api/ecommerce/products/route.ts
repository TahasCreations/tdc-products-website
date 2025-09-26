import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    let products = [];

    if (supabase) {
      // Supabase'den ürünleri çek
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          compare_price,
          stock,
          status,
          main_image,
          category_id,
          created_at,
          updated_at,
          categories!inner(name, emoji)
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (category) {
        query = query.eq('category_id', category);
      }
      if (status) {
        query = query.eq('status', status);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase products error:', error);
        throw error;
      }

      products = data?.map(product => ({
        id: product.id,
        name: product.name,
        title: product.name,
        price: product.price || 0,
        category: (product.categories as any)?.name || 'Kategori Yok',
        stock: product.stock || 0,
        status: product.status || 'draft',
        image: product.main_image || '/images/placeholder-product.jpg',
        description: (product as any).description || '',
        slug: (product as any).slug || '',
        sales: 0, // TODO: Gerçek satış verisi
        rating: 0, // TODO: Gerçek rating verisi
        createdAt: product.created_at,
        created_at: product.created_at
      })) || [];

    } else {
      // Fallback: Mock data
      products = [
        {
          id: '1',
          name: '3D Yazıcı FDM',
          title: '3D Yazıcı FDM',
          price: 2500,
          category: 'Elektronik',
          stock: 15,
          status: 'active',
          image: '/images/products/3d-printer-fdm.jpg',
          description: 'Yüksek kaliteli FDM 3D yazıcı',
          slug: '3d-yazici-fdm',
          sales: 25,
          rating: 4.5,
          createdAt: '2024-01-15T10:00:00Z',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: '3D Yazıcı SLA',
          title: '3D Yazıcı SLA',
          price: 3500,
          category: 'Elektronik',
          stock: 8,
          status: 'active',
          image: '/images/products/3d-printer-sla.jpg',
          description: 'Profesyonel SLA 3D yazıcı',
          slug: '3d-yazici-sla',
          sales: 12,
          rating: 4.8,
          createdAt: '2024-01-20T10:00:00Z',
          created_at: '2024-01-20T10:00:00Z'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: products.length
      }
    });

  } catch (error) {
    console.error('E-commerce products error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...productData } = body;

    if (action === 'create') {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            name: productData.name,
            price: parseFloat(productData.price),
            compare_price: parseFloat(productData.compare_price) || null,
            stock: parseInt(productData.stock) || 0,
            status: productData.status || 'draft',
            main_image: productData.image || '',
            description: productData.description || '',
            category_id: productData.category_id || null,
            slug: productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-')
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Product created successfully',
          data
        });
      } else {
        // Fallback: Mock creation
        const newProduct = {
          id: Date.now().toString(),
          ...productData,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Product created successfully (mock)',
          data: newProduct
        });
      }
    }

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .update({
            name: productData.name,
            price: parseFloat(productData.price),
            compare_price: parseFloat(productData.compare_price) || null,
            stock: parseInt(productData.stock) || 0,
            status: productData.status || 'draft',
            main_image: productData.image || '',
            description: productData.description || '',
            category_id: productData.category_id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Product updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Product updated successfully (mock)',
          data: { id, ...productData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Product deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Product deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('E-commerce products error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process product request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
