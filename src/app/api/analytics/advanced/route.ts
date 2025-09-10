import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30days';
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Calculate date range
    const daysBack = range === '7days' ? 7 : range === '30days' ? 30 : range === '90days' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get sales data
    const { data: salesData, error: salesError } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        created_at,
        status,
        order_items (
          quantity,
          price,
          products (
            name,
            category
          )
        )
      `)
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed');

    if (salesError) {
      throw salesError;
    }

    // Get customer data
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select(`
        id,
        total_orders,
        total_spent,
        registration_date,
        last_order_date
      `)
      .gte('registration_date', startDate.toISOString());

    if (customerError) {
      throw customerError;
    }

    // Get inventory data
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('products')
      .select(`
        id,
        current_stock,
        min_stock,
        max_stock,
        category
      `);

    if (inventoryError) {
      throw inventoryError;
    }

    // Generate analytics data
    const analyticsData = generateAnalyticsData(salesData, customerData, inventoryData, daysBack);

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Analitik veriler oluşturulamadı' },
      { status: 500 }
    );
  }
}

function generateAnalyticsData(salesData: any[], customerData: any[], inventoryData: any[], daysBack: number) {
  // Sales analytics
  const totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const dailySales = generateDailySales(salesData, daysBack);
  const monthlySales = generateMonthlySales(salesData);
  const salesByCategory = generateSalesByCategory(salesData);
  
  // Calculate growth rate
  const recentDays = Math.min(14, daysBack);
  const recentSales = dailySales.slice(-recentDays).reduce((sum, day) => sum + day, 0);
  const olderSales = dailySales.slice(0, -recentDays).reduce((sum, day) => sum + day, 0);
  const growthRate = olderSales > 0 ? ((recentSales - olderSales) / olderSales) * 100 : 0;

  // Customer analytics
  const totalCustomers = customerData.length;
  const newCustomers = customerData.filter(c => {
    const regDate = new Date(c.registration_date);
    const daysSinceReg = (Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceReg <= 30;
  }).length;
  
  const returningCustomers = customerData.filter(c => c.total_orders > 1).length;
  const customerSegments = generateCustomerSegments(customerData);

  // Inventory analytics
  const totalProducts = inventoryData.length;
  const lowStockItems = inventoryData.filter(item => item.current_stock <= item.min_stock).length;
  const outOfStockItems = inventoryData.filter(item => item.current_stock === 0).length;
  const turnoverRate = calculateTurnoverRate(salesData, inventoryData);

  // Performance analytics
  const conversionRate = 15.2; // Mock data
  const averageOrderValue = totalSales / Math.max(salesData.length, 1);
  const cartAbandonmentRate = 68.5; // Mock data
  const customerLifetimeValue = customerData.reduce((sum, c) => sum + (c.total_spent || 0), 0) / Math.max(customerData.length, 1);

  // AI Predictions
  const predictions = generateAIPredictions(salesData, customerData, daysBack);

  return {
    sales: {
      total: totalSales,
      growth: growthRate,
      daily: dailySales,
      monthly: monthlySales,
      byCategory: salesByCategory
    },
    customers: {
      total: totalCustomers,
      new: newCustomers,
      returning: returningCustomers,
      segments: customerSegments
    },
    inventory: {
      totalProducts,
      lowStock: lowStockItems,
      outOfStock: outOfStockItems,
      turnoverRate
    },
    performance: {
      conversionRate,
      averageOrderValue,
      cartAbandonmentRate,
      customerLifetimeValue
    },
    predictions
  };
}

function generateDailySales(salesData: any[], daysBack: number) {
  const dailySales = new Array(daysBack).fill(0);
  
  salesData.forEach(order => {
    const orderDate = new Date(order.created_at);
    const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo < daysBack) {
      dailySales[daysBack - 1 - daysAgo] += order.total_amount || 0;
    }
  });
  
  return dailySales;
}

function generateMonthlySales(salesData: any[]) {
  const monthlySales = new Array(12).fill(0);
  
  salesData.forEach(order => {
    const orderDate = new Date(order.created_at);
    const month = orderDate.getMonth();
    monthlySales[month] += order.total_amount || 0;
  });
  
  return monthlySales;
}

function generateSalesByCategory(salesData: any[]) {
  const categorySales: { [key: string]: number } = {};
  
  salesData.forEach(order => {
    order.order_items?.forEach((item: any) => {
      const category = item.products?.category || 'Diğer';
      if (!categorySales[category]) {
        categorySales[category] = 0;
      }
      categorySales[category] += (item.price || 0) * (item.quantity || 0);
    });
  });
  
  const totalSales = Object.values(categorySales).reduce((sum, amount) => sum + amount, 0);
  
  return Object.entries(categorySales).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalSales > 0 ? (amount / totalSales) * 100 : 0
  }));
}

function generateCustomerSegments(customerData: any[]) {
  const segments = [
    { segment: 'VIP', count: 0, value: 0 },
    { segment: 'Premium', count: 0, value: 0 },
    { segment: 'Standard', count: 0, value: 0 },
    { segment: 'Basic', count: 0, value: 0 }
  ];
  
  customerData.forEach(customer => {
    const totalSpent = customer.total_spent || 0;
    if (totalSpent > 10000) {
      segments[0].count++;
      segments[0].value += totalSpent;
    } else if (totalSpent > 5000) {
      segments[1].count++;
      segments[1].value += totalSpent;
    } else if (totalSpent > 1000) {
      segments[2].count++;
      segments[2].value += totalSpent;
    } else {
      segments[3].count++;
      segments[3].value += totalSpent;
    }
  });
  
  return segments;
}

function calculateTurnoverRate(salesData: any[], inventoryData: any[]) {
  const totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.current_stock || 0) * 100, 0); // Assuming 100 TL per item
  
  return totalInventoryValue > 0 ? totalSales / totalInventoryValue : 0;
}

function generateAIPredictions(salesData: any[], customerData: any[], daysBack: number) {
  const recentSales = salesData.slice(-Math.min(14, salesData.length));
  const avgDailySales = recentSales.reduce((sum, order) => sum + (order.total_amount || 0), 0) / Math.max(recentSales.length, 1);
  
  const nextMonthSales = avgDailySales * 30;
  const confidence = Math.min(95, 70 + (salesData.length > 100 ? 15 : salesData.length > 50 ? 10 : 5));
  
  const recommendations = [
    'Satış trendi yükselişte, stok seviyelerini artırın',
    'VIP müşterilere özel kampanyalar düzenleyin',
    'Düşük performans gösteren kategorileri gözden geçirin',
    'Müşteri sadakat programları uygulayın'
  ];
  
  return {
    nextMonthSales,
    confidence,
    recommendations
  };
}
