import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock security roles data
    const roles = [
      {
        id: '1',
        name: 'Admin',
        description: 'Tam sistem erişimi - tüm yetkilere sahip',
        permissions: ['read', 'write', 'delete', 'admin', 'security', 'audit'],
        level: 5,
        color: '#DC2626'
      },
      {
        id: '2',
        name: 'Manager',
        description: 'Yönetici seviyesi - okuma ve yazma yetkisi',
        permissions: ['read', 'write', 'reports', 'analytics'],
        level: 4,
        color: '#EA580C'
      },
      {
        id: '3',
        name: 'Supervisor',
        description: 'Süpervizör seviyesi - sınırlı yazma yetkisi',
        permissions: ['read', 'write', 'reports'],
        level: 3,
        color: '#F59E0B'
      },
      {
        id: '4',
        name: 'User',
        description: 'Standart kullanıcı - sadece okuma yetkisi',
        permissions: ['read'],
        level: 2,
        color: '#059669'
      },
      {
        id: '5',
        name: 'Guest',
        description: 'Misafir kullanıcı - çok sınırlı erişim',
        permissions: ['read_limited'],
        level: 1,
        color: '#6B7280'
      }
    ];

    return NextResponse.json(roles);

  } catch (error) {
    console.error('Security roles error:', error);
    return NextResponse.json(
      { error: 'Rol verileri alınamadı' },
      { status: 500 }
    );
  }
}
