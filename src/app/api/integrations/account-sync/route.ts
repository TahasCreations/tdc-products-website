import { NextRequest, NextResponse } from 'next/server';

// Mock data for sync accounts
let syncAccounts = [
  {
    id: '1',
    name: 'Stripe Ödeme Hesabı',
    type: 'payment',
    provider: 'Stripe',
    status: 'synced',
    lastSync: '2024-01-15T10:30:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 1247,
    autoSync: true,
    accessToken: 'sk_test_mock_stripe_token',
    refreshToken: null,
    expiresAt: null
  },
  {
    id: '2',
    name: 'PayPal Ödeme Hesabı',
    type: 'payment',
    provider: 'PayPal',
    status: 'synced',
    lastSync: '2024-01-15T10:25:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 892,
    autoSync: true,
    accessToken: 'mock_paypal_token',
    refreshToken: null,
    expiresAt: null
  },
  {
    id: '3',
    name: 'WooCommerce Envanter',
    type: 'inventory',
    provider: 'WooCommerce',
    status: 'syncing',
    lastSync: '2024-01-15T09:45:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 3456,
    autoSync: true,
    accessToken: 'mock_woocommerce_token',
    refreshToken: null,
    expiresAt: null
  },
  {
    id: '4',
    name: 'Mailchimp Müşteri Listesi',
    type: 'customer',
    provider: 'Mailchimp',
    status: 'error',
    lastSync: '2024-01-14T16:20:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 0,
    autoSync: false,
    errorMessage: 'API anahtarı geçersiz',
    accessToken: 'invalid_mailchimp_token',
    refreshToken: null,
    expiresAt: null
  },
  {
    id: '5',
    name: 'Google Analytics',
    type: 'analytics',
    provider: 'Google',
    status: 'synced',
    lastSync: '2024-01-15T10:15:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 15678,
    autoSync: true,
    accessToken: 'mock_google_token',
    refreshToken: 'mock_google_refresh',
    expiresAt: '2024-02-15T10:15:00Z'
  }
];

// Mock sync logs
let syncLogs = [
  {
    id: '1',
    accountId: '1',
    accountName: 'Stripe Ödeme Hesabı',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success',
    message: '1,247 kayıt başarıyla senkronize edildi',
    recordsProcessed: 1247,
    duration: 45000 // milliseconds
  },
  {
    id: '2',
    accountId: '2',
    accountName: 'PayPal Ödeme Hesabı',
    timestamp: '2024-01-15T10:25:00Z',
    status: 'success',
    message: '892 kayıt başarıyla senkronize edildi',
    recordsProcessed: 892,
    duration: 32000
  },
  {
    id: '3',
    accountId: '3',
    accountName: 'WooCommerce Envanter',
    timestamp: '2024-01-15T09:45:00Z',
    status: 'syncing',
    message: 'Senkronizasyon devam ediyor...',
    recordsProcessed: 0,
    duration: 0
  },
  {
    id: '4',
    accountId: '4',
    accountName: 'Mailchimp Müşteri Listesi',
    timestamp: '2024-01-14T16:20:00Z',
    status: 'error',
    message: 'API anahtarı geçersiz',
    recordsProcessed: 0,
    duration: 0
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const logs = searchParams.get('logs');

    if (logs === 'true') {
      return NextResponse.json({
        success: true,
        data: syncLogs
      });
    }

    let filteredAccounts = syncAccounts;
    
    if (type) {
      filteredAccounts = syncAccounts.filter(account => account.type === type);
    }

    // Calculate stats
    const stats = {
      totalAccounts: syncAccounts.length,
      syncedAccounts: syncAccounts.filter(a => a.status === 'synced').length,
      errorAccounts: syncAccounts.filter(a => a.status === 'error').length,
      pendingAccounts: syncAccounts.filter(a => a.status === 'pending').length,
      lastFullSync: syncAccounts.reduce((latest, account) => 
        account.lastSync > latest ? account.lastSync : latest, '2024-01-15T10:30:00Z'
      ),
      nextScheduledSync: '2024-01-15T11:00:00Z'
    };

    return NextResponse.json({
      success: true,
      data: filteredAccounts,
      stats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch sync accounts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, accountId, autoSync } = body;

    if (action === 'sync') {
      const accountIndex = syncAccounts.findIndex(account => account.id === accountId);
      
      if (accountIndex !== -1) {
        // Update account status to syncing
        syncAccounts[accountIndex].status = 'syncing';
        
        // Add sync log entry
        const newLog = {
          id: Date.now().toString(),
          accountId,
          accountName: syncAccounts[accountIndex].name,
          timestamp: new Date().toISOString(),
          status: 'syncing',
          message: 'Senkronizasyon başlatıldı',
          recordsProcessed: 0,
          duration: 0
        };
        syncLogs.unshift(newLog);

        // Simulate sync completion after delay
        setTimeout(() => {
          syncAccounts[accountIndex].status = 'synced';
          syncAccounts[accountIndex].lastSync = new Date().toISOString();
          syncAccounts[accountIndex].recordsCount += Math.floor(Math.random() * 100);
          syncAccounts[accountIndex].errorMessage = undefined;

          // Update log entry
          const logIndex = syncLogs.findIndex(log => log.id === newLog.id);
          if (logIndex !== -1) {
            syncLogs[logIndex].status = 'success';
            syncLogs[logIndex].message = `${syncAccounts[accountIndex].recordsCount} kayıt başarıyla senkronize edildi`;
            syncLogs[logIndex].recordsProcessed = syncAccounts[accountIndex].recordsCount;
            syncLogs[logIndex].duration = 30000 + Math.floor(Math.random() * 60000);
          }
        }, 3000);

        return NextResponse.json({
          success: true,
          message: 'Sync started successfully',
          data: syncAccounts[accountIndex]
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Account not found'
        }, { status: 404 });
      }
    }

    if (action === 'toggle-autosync') {
      const accountIndex = syncAccounts.findIndex(account => account.id === accountId);
      
      if (accountIndex !== -1) {
        syncAccounts[accountIndex].autoSync = autoSync;
        
        return NextResponse.json({
          success: true,
          message: 'Auto sync setting updated',
          data: syncAccounts[accountIndex]
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Account not found'
        }, { status: 404 });
      }
    }

    if (action === 'retry') {
      const accountIndex = syncAccounts.findIndex(account => account.id === accountId);
      
      if (accountIndex !== -1) {
        // Clear error and set to pending
        syncAccounts[accountIndex].status = 'pending';
        syncAccounts[accountIndex].errorMessage = undefined;

        // Add retry log entry
        const newLog = {
          id: Date.now().toString(),
          accountId,
          accountName: syncAccounts[accountIndex].name,
          timestamp: new Date().toISOString(),
          status: 'syncing',
          message: 'Hata sonrası tekrar deneme başlatıldı',
          recordsProcessed: 0,
          duration: 0
        };
        syncLogs.unshift(newLog);

        return NextResponse.json({
          success: true,
          message: 'Retry initiated',
          data: syncAccounts[accountIndex]
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Account not found'
        }, { status: 404 });
      }
    }

    if (action === 'sync-all') {
      const accountsToSync = syncAccounts.filter(account => 
        account.status !== 'syncing' && account.autoSync
      );

      for (const account of accountsToSync) {
        account.status = 'syncing';
        
        const newLog = {
          id: Date.now().toString() + Math.random(),
          accountId: account.id,
          accountName: account.name,
          timestamp: new Date().toISOString(),
          status: 'syncing',
          message: 'Toplu senkronizasyon başlatıldı',
          recordsProcessed: 0,
          duration: 0
        };
        syncLogs.unshift(newLog);

        // Simulate individual sync completion
        setTimeout(() => {
          account.status = 'synced';
          account.lastSync = new Date().toISOString();
          account.recordsCount += Math.floor(Math.random() * 100);
          account.errorMessage = undefined;

          const logIndex = syncLogs.findIndex(log => log.id === newLog.id);
          if (logIndex !== -1) {
            syncLogs[logIndex].status = 'success';
            syncLogs[logIndex].message = `${account.recordsCount} kayıt başarıyla senkronize edildi`;
            syncLogs[logIndex].recordsProcessed = account.recordsCount;
            syncLogs[logIndex].duration = 30000 + Math.floor(Math.random() * 60000);
          }
        }, Math.random() * 10000 + 2000);
      }

      return NextResponse.json({
        success: true,
        message: `Sync initiated for ${accountsToSync.length} accounts`,
        data: accountsToSync
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to process request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
