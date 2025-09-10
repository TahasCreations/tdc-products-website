import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock workflow executions data
    const executions = [
      {
        id: '1',
        workflowId: '1',
        workflowName: 'Satış Onay Süreci',
        status: 'completed',
        currentStep: 'Tamamlandı',
        data: { orderId: '12345', amount: 15000 },
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        steps: [
          { id: '1', stepId: '1', stepName: 'Tutar Kontrolü', status: 'completed', startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000).toISOString() },
          { id: '2', stepId: '2', stepName: 'Müdür Onayı', status: 'completed', startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000).toISOString(), completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
          { id: '3', stepId: '3', stepName: 'Bildirim Gönder', status: 'completed', startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 10 * 1000).toISOString() }
        ]
      },
      {
        id: '2',
        workflowId: '2',
        workflowName: 'Stok Sipariş Otomasyonu',
        status: 'running',
        currentStep: 'Sipariş Oluştur',
        data: { productId: '67890', currentStock: 5, minStock: 10 },
        startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        steps: [
          { id: '4', stepId: '4', stepName: 'Stok Kontrolü', status: 'completed', startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 30 * 60 * 1000 + 5 * 1000).toISOString() },
          { id: '5', stepId: '5', stepName: 'Sipariş Oluştur', status: 'running', startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() }
        ]
      },
      {
        id: '3',
        workflowId: '3',
        workflowName: 'Müşteri Takip Süreci',
        status: 'failed',
        currentStep: 'İkinci E-posta',
        data: { customerId: '11111', email: 'test@example.com' },
        startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        error: 'E-posta servisi geçici olarak kullanılamıyor',
        steps: [
          { id: '7', stepId: '7', stepName: 'Hoş Geldin E-postası', status: 'completed', startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 1000).toISOString() },
          { id: '8', stepId: '8', stepName: '3 Gün Sonra Hatırlatma', status: 'completed', startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 1000).toISOString() },
          { id: '9', stepId: '9', stepName: 'İkinci E-posta', status: 'failed', startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 1000).toISOString(), error: 'E-posta servisi geçici olarak kullanılamıyor' }
        ]
      }
    ];

    return NextResponse.json(executions);

  } catch (error) {
    console.error('Workflow executions error:', error);
    return NextResponse.json(
      { error: 'İş akışı çalıştırmaları alınamadı' },
      { status: 500 }
    );
  }
}
