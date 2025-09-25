import { NextRequest, NextResponse } from 'next/server';

// Mock data for social media accounts
let socialAccounts = [
  {
    id: '1',
    platform: 'twitter',
    name: 'TDC Products',
    username: '@tdcproducts',
    avatar: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    followers: 12500,
    posts: 234,
    engagement: 4.2,
    accessToken: 'mock_token_1',
    refreshToken: 'mock_refresh_1',
    expiresAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    platform: 'instagram',
    name: 'TDC Products',
    username: '@tdcproducts',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-15T09:15:00Z',
    followers: 8900,
    posts: 156,
    engagement: 6.8,
    accessToken: 'mock_token_2',
    refreshToken: 'mock_refresh_2',
    expiresAt: '2024-02-15T09:15:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    let filteredAccounts = socialAccounts;
    
    if (platform) {
      filteredAccounts = socialAccounts.filter(account => account.platform === platform);
    }

    return NextResponse.json({
      success: true,
      data: filteredAccounts
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch social media accounts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, platform, accessToken, refreshToken, expiresAt } = body;

    if (action === 'connect') {
      // Simulate OAuth connection
      const newAccount = {
        id: Date.now().toString(),
        platform,
        name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
        username: `@tdcproducts_${platform}`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'connected',
        lastSync: new Date().toISOString(),
        followers: Math.floor(Math.random() * 10000),
        posts: Math.floor(Math.random() * 500),
        engagement: Math.random() * 10,
        accessToken: accessToken || `mock_token_${Date.now()}`,
        refreshToken: refreshToken || `mock_refresh_${Date.now()}`,
        expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Check if account already exists
      const existingAccountIndex = socialAccounts.findIndex(account => account.platform === platform);
      
      if (existingAccountIndex !== -1) {
        socialAccounts[existingAccountIndex] = newAccount;
      } else {
        socialAccounts.push(newAccount);
      }

      return NextResponse.json({
        success: true,
        message: 'Account connected successfully',
        data: newAccount
      });
    }

    if (action === 'disconnect') {
      const { accountId } = body;
      const accountIndex = socialAccounts.findIndex(account => account.id === accountId);
      
      if (accountIndex !== -1) {
        socialAccounts[accountIndex].status = 'disconnected';
        return NextResponse.json({
          success: true,
          message: 'Account disconnected successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Account not found'
        }, { status: 404 });
      }
    }

    if (action === 'sync') {
      const { accountId } = body;
      const accountIndex = socialAccounts.findIndex(account => account.id === accountId);
      
      if (accountIndex !== -1) {
        // Simulate sync process
        socialAccounts[accountIndex].status = 'syncing';
        socialAccounts[accountIndex].lastSync = new Date().toISOString();
        socialAccounts[accountIndex].followers += Math.floor(Math.random() * 100);
        socialAccounts[accountIndex].posts += Math.floor(Math.random() * 5);
        socialAccounts[accountIndex].engagement = Math.max(0, socialAccounts[accountIndex].engagement + (Math.random() - 0.5) * 2);
        
        // Simulate sync completion after delay
        setTimeout(() => {
          socialAccounts[accountIndex].status = 'connected';
        }, 3000);

        return NextResponse.json({
          success: true,
          message: 'Sync started successfully',
          data: socialAccounts[accountIndex]
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Account not found'
        }, { status: 404 });
      }
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
