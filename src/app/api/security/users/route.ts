import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock security users data
    const users = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@company.com',
        role: 'Admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        twoFactorEnabled: true,
        permissions: ['read', 'write', 'delete', 'admin'],
        loginAttempts: 0,
        lockedUntil: null
      },
      {
        id: '2',
        name: 'Mehmet Kaya',
        email: 'mehmet@company.com',
        role: 'Manager',
        status: 'active',
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        twoFactorEnabled: true,
        permissions: ['read', 'write'],
        loginAttempts: 0,
        lockedUntil: null
      },
      {
        id: '3',
        name: 'Ayşe Demir',
        email: 'ayse@company.com',
        role: 'User',
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        twoFactorEnabled: false,
        permissions: ['read'],
        loginAttempts: 0,
        lockedUntil: null
      },
      {
        id: '4',
        name: 'Fatma Özkan',
        email: 'fatma@company.com',
        role: 'User',
        status: 'suspended',
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        twoFactorEnabled: false,
        permissions: ['read'],
        loginAttempts: 5,
        lockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'Ali Veli',
        email: 'ali@company.com',
        role: 'User',
        status: 'inactive',
        lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        twoFactorEnabled: false,
        permissions: ['read'],
        loginAttempts: 0,
        lockedUntil: null
      }
    ];

    return NextResponse.json(users);

  } catch (error) {
    console.error('Security users error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı verileri alınamadı' },
      { status: 500 }
    );
  }
}
