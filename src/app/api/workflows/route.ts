import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock workflows data
    const workflows = [
      {
        id: '1',
        name: 'Satış Onay Süreci',
        description: 'Belirli tutar üzeri satışlar için otomatik onay süreci',
        category: 'sales',
        status: 'active',
        triggers: [
          { id: '1', type: 'event', event: 'order.created', enabled: true }
        ],
        steps: [
          { id: '1', name: 'Tutar Kontrolü', type: 'condition', order: 1, required: true },
          { id: '2', name: 'Müdür Onayı', type: 'approval', approver: 'manager', order: 2, required: true },
          { id: '3', name: 'Bildirim Gönder', type: 'notification', order: 3, required: true }
        ],
        conditions: [
          { id: '1', field: 'amount', operator: 'greater', value: 10000, logic: 'AND' }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        executions: 45,
        successRate: 95
      },
      {
        id: '2',
        name: 'Stok Sipariş Otomasyonu',
        description: 'Stok seviyesi düştüğünde otomatik sipariş oluşturma',
        category: 'inventory',
        status: 'active',
        triggers: [
          { id: '2', type: 'condition', condition: 'stock <= min_stock', enabled: true }
        ],
        steps: [
          { id: '4', name: 'Stok Kontrolü', type: 'condition', order: 1, required: true },
          { id: '5', name: 'Sipariş Oluştur', type: 'action', action: 'create_purchase_order', order: 2, required: true },
          { id: '6', name: 'Tedarikçi Bildirimi', type: 'notification', order: 3, required: true }
        ],
        conditions: [
          { id: '2', field: 'current_stock', operator: 'less', value: 'min_stock', logic: 'AND' }
        ],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        executions: 23,
        successRate: 87
      },
      {
        id: '3',
        name: 'Müşteri Takip Süreci',
        description: 'Yeni müşteriler için otomatik takip e-postaları',
        category: 'marketing',
        status: 'active',
        triggers: [
          { id: '3', type: 'event', event: 'customer.registered', enabled: true }
        ],
        steps: [
          { id: '7', name: 'Hoş Geldin E-postası', type: 'notification', order: 1, required: true },
          { id: '8', name: '3 Gün Sonra Hatırlatma', type: 'delay', delay: 3, order: 2, required: true },
          { id: '9', name: 'İkinci E-posta', type: 'notification', order: 3, required: true }
        ],
        conditions: [],
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        executions: 156,
        successRate: 92
      }
    ];

    return NextResponse.json(workflows);

  } catch (error) {
    console.error('Workflows error:', error);
    return NextResponse.json(
      { error: 'İş akışları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const workflowData = await request.json();
    
    // Mock workflow creation
    const newWorkflow = {
      id: Date.now().toString(),
      ...workflowData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executions: 0,
      successRate: 0
    };

    return NextResponse.json(newWorkflow);

  } catch (error) {
    console.error('Workflow creation error:', error);
    return NextResponse.json(
      { error: 'İş akışı oluşturulamadı' },
      { status: 500 }
    );
  }
}
