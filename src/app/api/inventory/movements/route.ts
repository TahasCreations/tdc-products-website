import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock stock movements data
    const movements = [
      {
        id: '1',
        itemId: '1',
        type: 'in',
        quantity: 100,
        reason: 'Satın alma',
        reference: 'PO-2024-001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Ahmet Yılmaz',
        warehouse: 'Ana Depo'
      },
      {
        id: '2',
        itemId: '2',
        type: 'out',
        quantity: 50,
        reason: 'Satış',
        reference: 'SO-2024-001',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user: 'Mehmet Kaya',
        warehouse: 'Şube Depo'
      },
      {
        id: '3',
        itemId: '3',
        type: 'transfer',
        quantity: 25,
        reason: 'Depo transferi',
        reference: 'TR-2024-001',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'Ayşe Demir',
        warehouse: 'Bölge Depo'
      }
    ];

    return NextResponse.json(movements);

  } catch (error) {
    console.error('Stock movements error:', error);
    return NextResponse.json(
      { error: 'Stok hareketleri alınamadı' },
      { status: 500 }
    );
  }
}
