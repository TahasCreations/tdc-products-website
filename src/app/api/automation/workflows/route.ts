import { NextRequest, NextResponse } from 'next/server';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: {
    type: 'schedule' | 'event' | 'condition' | 'manual';
    config: any;
  };
  actions: Array<{
    id: string;
    type: 'email' | 'sms' | 'webhook' | 'database' | 'notification';
    config: any;
    order: number;
  }>;
  lastRun: string | null;
  nextRun: string | null;
  successRate: number;
  totalRuns: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  error: string | null;
  results: any;
}

// Mock workflow data
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Yeni Sipariş Bildirimi',
    description: 'Yeni sipariş geldiğinde müşteriye e-posta ve SMS gönder',
    status: 'active',
    trigger: {
      type: 'event',
      config: { event: 'order.created' }
    },
    actions: [
      {
        id: '1',
        type: 'email',
        config: { template: 'order-confirmation', to: 'customer.email' },
        order: 1
      },
      {
        id: '2',
        type: 'sms',
        config: { template: 'order-sms', to: 'customer.phone' },
        order: 2
      }
    ],
    lastRun: '2024-01-15T10:30:00Z',
    nextRun: null,
    successRate: 98.5,
    totalRuns: 1247,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Stok Uyarı Sistemi',
    description: 'Stok seviyesi %10 altına düştüğünde satın alma ekibine bildirim gönder',
    status: 'active',
    trigger: {
      type: 'condition',
      config: { condition: 'inventory.level < 10' }
    },
    actions: [
      {
        id: '3',
        type: 'notification',
        config: { 
          channel: 'slack', 
          message: 'Stok uyarısı: {product.name} stokta azaldı',
          to: 'purchasing-team'
        },
        order: 1
      },
      {
        id: '4',
        type: 'email',
        config: { 
          template: 'low-stock-alert', 
          to: 'purchasing@company.com',
          cc: 'manager@company.com'
        },
        order: 2
      }
    ],
    lastRun: '2024-01-15T09:15:00Z',
    nextRun: null,
    successRate: 100,
    totalRuns: 23,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Haftalık Rapor',
    description: 'Her Pazartesi sabahı yöneticilere haftalık satış raporu gönder',
    status: 'active',
    trigger: {
      type: 'schedule',
      config: { cron: '0 9 * * 1' } // Her Pazartesi saat 09:00
    },
    actions: [
      {
        id: '5',
        type: 'email',
        config: { 
          template: 'weekly-report', 
          to: 'managers@company.com',
          attachments: ['weekly-sales-report.pdf']
        },
        order: 1
      }
    ],
    lastRun: '2024-01-15T09:00:00Z',
    nextRun: '2024-01-22T09:00:00Z',
    successRate: 95.2,
    totalRuns: 52,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '4',
    name: 'Müşteri Takip Sistemi',
    description: '7 gün boyunca siteyi ziyaret etmeyen müşterilere e-posta gönder',
    status: 'draft',
    trigger: {
      type: 'schedule',
      config: { cron: '0 10 * * *' } // Her gün saat 10:00
    },
    actions: [
      {
        id: '6',
        type: 'email',
        config: { 
          template: 'comeback-email', 
          to: 'customer.email',
          subject: 'Özledik! Geri dönün ve %20 indirim kazanın'
        },
        order: 1
      }
    ],
    lastRun: null,
    nextRun: null,
    successRate: 0,
    totalRuns: 0,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

const mockExecutions: WorkflowExecution[] = [
  {
    id: '1',
    workflowId: '1',
    status: 'completed',
    startedAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:30:15Z',
    duration: 15,
    error: null,
    results: { emailsSent: 1, smsSent: 1 }
  },
  {
    id: '2',
    workflowId: '2',
    status: 'completed',
    startedAt: '2024-01-15T09:15:00Z',
    completedAt: '2024-01-15T09:15:05Z',
    duration: 5,
    error: null,
    results: { notificationsSent: 1, emailsSent: 1 }
  },
  {
    id: '3',
    workflowId: '3',
    status: 'failed',
    startedAt: '2024-01-15T09:00:00Z',
    completedAt: '2024-01-15T09:00:30Z',
    duration: 30,
    error: 'Email template not found',
    results: null
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    let workflows = mockWorkflows;
    
    if (status) {
      workflows = workflows.filter(w => w.status === status);
    }

    workflows = workflows.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        workflows,
        total: mockWorkflows.length,
        executions: mockExecutions.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Workflows API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Workflow verileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workflowId, workflowData } = body;

    switch (action) {
      case 'create':
        const newWorkflow: Workflow = {
          id: Date.now().toString(),
          ...workflowData,
          status: 'draft',
          lastRun: null,
          nextRun: null,
          successRate: 0,
          totalRuns: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return NextResponse.json({
          success: true,
          data: newWorkflow,
          message: 'Workflow başarıyla oluşturuldu'
        });

      case 'update':
        return NextResponse.json({
          success: true,
          message: 'Workflow başarıyla güncellendi'
        });

      case 'execute':
        // Simulate workflow execution
        const execution: WorkflowExecution = {
          id: Date.now().toString(),
          workflowId,
          status: 'running',
          startedAt: new Date().toISOString(),
          completedAt: null,
          duration: null,
          error: null,
          results: null
        };

        // Simulate processing
        setTimeout(() => {
          execution.status = 'completed';
          execution.completedAt = new Date().toISOString();
          execution.duration = Math.floor(Math.random() * 30) + 5;
          execution.results = { success: true };
        }, 2000);

        return NextResponse.json({
          success: true,
          data: execution,
          message: 'Workflow çalıştırıldı'
        });

      case 'delete':
        return NextResponse.json({
          success: true,
          message: 'Workflow başarıyla silindi'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Workflow Action Error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
