import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock security permissions data
    const permissions = [
      {
        id: '1',
        name: 'read',
        description: 'Veri okuma yetkisi',
        category: 'basic',
        resource: 'all',
        action: 'read'
      },
      {
        id: '2',
        name: 'write',
        description: 'Veri yazma yetkisi',
        category: 'basic',
        resource: 'all',
        action: 'write'
      },
      {
        id: '3',
        name: 'delete',
        description: 'Veri silme yetkisi',
        category: 'basic',
        resource: 'all',
        action: 'delete'
      },
      {
        id: '4',
        name: 'admin',
        description: 'Yönetici yetkisi',
        category: 'admin',
        resource: 'system',
        action: 'admin'
      },
      {
        id: '5',
        name: 'security',
        description: 'Güvenlik ayarları yetkisi',
        category: 'security',
        resource: 'security',
        action: 'manage'
      },
      {
        id: '6',
        name: 'audit',
        description: 'Audit log yetkisi',
        category: 'security',
        resource: 'audit',
        action: 'view'
      },
      {
        id: '7',
        name: 'reports',
        description: 'Rapor görüntüleme yetkisi',
        category: 'reports',
        resource: 'reports',
        action: 'view'
      },
      {
        id: '8',
        name: 'analytics',
        description: 'Analitik yetkisi',
        category: 'analytics',
        resource: 'analytics',
        action: 'view'
      },
      {
        id: '9',
        name: 'read_limited',
        description: 'Sınırlı okuma yetkisi',
        category: 'basic',
        resource: 'limited',
        action: 'read'
      }
    ];

    return NextResponse.json(permissions);

  } catch (error) {
    console.error('Security permissions error:', error);
    return NextResponse.json(
      { error: 'İzin verileri alınamadı' },
      { status: 500 }
    );
  }
}
