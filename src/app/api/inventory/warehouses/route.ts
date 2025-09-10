import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock warehouse data - in production, this would come from database
    const warehouses = [
      {
        id: '1',
        name: 'Ana Depo',
        location: 'İstanbul, Türkiye',
        capacity: 10000,
        currentStock: 7500,
        manager: 'Ahmet Yılmaz',
        contact: 'ahmet@company.com'
      },
      {
        id: '2',
        name: 'Şube Depo',
        location: 'Ankara, Türkiye',
        capacity: 5000,
        currentStock: 3200,
        manager: 'Mehmet Kaya',
        contact: 'mehmet@company.com'
      },
      {
        id: '3',
        name: 'Bölge Depo',
        location: 'İzmir, Türkiye',
        capacity: 3000,
        currentStock: 1800,
        manager: 'Ayşe Demir',
        contact: 'ayse@company.com'
      }
    ];

    return NextResponse.json(warehouses);

  } catch (error) {
    console.error('Warehouses error:', error);
    return NextResponse.json(
      { error: 'Depo verileri alınamadı' },
      { status: 500 }
    );
  }
}
