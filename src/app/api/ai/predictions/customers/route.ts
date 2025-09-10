import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get customer data
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        email,
        total_orders,
        total_spent,
        average_order_value,
        last_order_date,
        registration_date,
        orders (
          id,
          total_amount,
          created_at,
          status
        )
      `);

    if (customerError) {
      throw customerError;
    }

    // AI Customer Segmentation Algorithm
    const segmentation = await generateCustomerSegmentation(customerData);

    return NextResponse.json(segmentation);

  } catch (error) {
    console.error('Customer segmentation error:', error);
    return NextResponse.json(
      { error: 'Müşteri segmentasyonu oluşturulamadı' },
      { status: 500 }
    );
  }
}

async function generateCustomerSegmentation(customerData: any[]) {
  // Calculate customer metrics
  const customersWithMetrics = customerData.map(customer => {
    const orders = customer.orders || [];
    const totalSpent = customer.total_spent || 0;
    const totalOrders = customer.total_orders || 0;
    const avgOrderValue = customer.average_order_value || 0;
    
    // Calculate recency (days since last order)
    const lastOrderDate = customer.last_order_date ? new Date(customer.last_order_date) : null;
    const recency = lastOrderDate ? Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)) : 365;
    
    // Calculate frequency (orders per month)
    const registrationDate = customer.registration_date ? new Date(customer.registration_date) : new Date();
    const monthsSinceRegistration = Math.max(1, Math.floor((Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const frequency = totalOrders / monthsSinceRegistration;
    
    // Calculate monetary value
    const monetary = totalSpent;
    
    // Calculate customer lifetime value (CLV)
    const clv = avgOrderValue * frequency * 12; // Annual CLV
    
    // Calculate churn risk
    let churnRisk = 'low';
    if (recency > 90) churnRisk = 'high';
    else if (recency > 30) churnRisk = 'medium';
    
    return {
      ...customer,
      metrics: {
        recency,
        frequency,
        monetary,
        clv,
        churnRisk
      }
    };
  });
  
  // RFM Analysis for segmentation
  const rfmSegments = performRFMAnalysis(customersWithMetrics);
  
  // Behavioral segmentation
  const behavioralSegments = performBehavioralSegmentation(customersWithMetrics);
  
  // Value-based segmentation
  const valueSegments = performValueBasedSegmentation(customersWithMetrics);
  
  // Combine all segmentations
  const segments = [
    ...rfmSegments,
    ...behavioralSegments,
    ...valueSegments
  ];
  
  // Calculate overall confidence
  const confidence = Math.min(95, 70 + (customerData.length > 100 ? 15 : customerData.length > 50 ? 10 : 5));
  
  return {
    confidence,
    segmentation: {
      segments,
      totalCustomers: customerData.length,
      segmentDistribution: segments.map(seg => ({
        segment: seg.name,
        count: seg.customerCount,
        percentage: Math.round((seg.customerCount / customerData.length) * 100),
        averageValue: seg.averageValue
      })),
      insights: {
        highValueCustomers: segments.find(s => s.name === 'VIP')?.customerCount || 0,
        atRiskCustomers: segments.find(s => s.name === 'At Risk')?.customerCount || 0,
        newCustomers: segments.find(s => s.name === 'New')?.customerCount || 0,
        loyalCustomers: segments.find(s => s.name === 'Loyal')?.customerCount || 0
      }
    },
    reasoning: `Toplam ${customerData.length} müşteri analiz edildi. RFM analizi, davranışsal analiz ve değer tabanlı segmentasyon kullanılarak ${segments.length} segment oluşturuldu.`,
    recommendations: [
      'VIP müşterilere özel kampanyalar düzenleyin',
      'At risk müşterileri geri kazanmak için kampanyalar başlatın',
      'Yeni müşterilere onboarding süreci uygulayın',
      'Sadık müşterilere ödül programları sunun',
      'Segment bazlı kişiselleştirilmiş pazarlama stratejileri geliştirin'
    ]
  };
}

function performRFMAnalysis(customers: any[]) {
  // Sort customers by RFM metrics
  const sortedByRecency = [...customers].sort((a, b) => a.metrics.recency - b.metrics.recency);
  const sortedByFrequency = [...customers].sort((a, b) => b.metrics.frequency - a.metrics.frequency);
  const sortedByMonetary = [...customers].sort((a, b) => b.metrics.monetary - a.metrics.monetary);
  
  // Assign RFM scores (1-5 scale)
  const customersWithRFM = customers.map(customer => {
    const recencyScore = Math.ceil((sortedByRecency.indexOf(customer) + 1) / (customers.length / 5));
    const frequencyScore = Math.ceil((sortedByFrequency.indexOf(customer) + 1) / (customers.length / 5));
    const monetaryScore = Math.ceil((sortedByMonetary.indexOf(customer) + 1) / (customers.length / 5));
    
    return {
      ...customer,
      rfm: { recencyScore, frequencyScore, monetaryScore }
    };
  });
  
  // Create RFM segments
  const segments = [
    {
      id: 'champions',
      name: 'Champions',
      description: 'En değerli müşteriler - yüksek RFM skorları',
      criteria: { minRFM: 4, maxRFM: 5 },
      customers: customersWithRFM.filter(c => 
        c.rfm.recencyScore >= 4 && c.rfm.frequencyScore >= 4 && c.rfm.monetaryScore >= 4
      ),
      color: '#10B981'
    },
    {
      id: 'loyal',
      name: 'Loyal',
      description: 'Sadık müşteriler - düzenli alışveriş yapanlar',
      criteria: { minRFM: 3, maxRFM: 5 },
      customers: customersWithRFM.filter(c => 
        c.rfm.recencyScore >= 3 && c.rfm.frequencyScore >= 4 && c.rfm.monetaryScore >= 3
      ),
      color: '#3B82F6'
    },
    {
      id: 'at-risk',
      name: 'At Risk',
      description: 'Risk altındaki müşteriler - uzun süre alışveriş yapmayanlar',
      criteria: { minRFM: 1, maxRFM: 3 },
      customers: customersWithRFM.filter(c => 
        c.rfm.recencyScore <= 2 && c.rfm.frequencyScore >= 3 && c.rfm.monetaryScore >= 3
      ),
      color: '#F59E0B'
    },
    {
      id: 'new',
      name: 'New',
      description: 'Yeni müşteriler - az alışveriş geçmişi olanlar',
      criteria: { minRFM: 1, maxRFM: 3 },
      customers: customersWithRFM.filter(c => 
        c.rfm.recencyScore >= 4 && c.rfm.frequencyScore <= 2 && c.rfm.monetaryScore <= 2
      ),
      color: '#8B5CF6'
    }
  ];
  
  return segments.map(segment => ({
    id: segment.id,
    name: segment.name,
    description: segment.description,
    customerCount: segment.customers.length,
    averageValue: segment.customers.length > 0 ? 
      Math.round(segment.customers.reduce((sum, c) => sum + c.metrics.monetary, 0) / segment.customers.length) : 0,
    color: segment.color,
    growthRate: 0 // Would need historical data to calculate
  }));
}

function performBehavioralSegmentation(customers: any[]) {
  const segments = [
    {
      id: 'vip',
      name: 'VIP',
      description: 'En yüksek değerli müşteriler',
      customers: customers.filter(c => c.metrics.clv > 10000),
      color: '#DC2626'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Yüksek değerli müşteriler',
      customers: customers.filter(c => c.metrics.clv > 5000 && c.metrics.clv <= 10000),
      color: '#EA580C'
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Orta değerli müşteriler',
      customers: customers.filter(c => c.metrics.clv > 1000 && c.metrics.clv <= 5000),
      color: '#059669'
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'Düşük değerli müşteriler',
      customers: customers.filter(c => c.metrics.clv <= 1000),
      color: '#6B7280'
    }
  ];
  
  return segments.map(segment => ({
    id: segment.id,
    name: segment.name,
    description: segment.description,
    customerCount: segment.customers.length,
    averageValue: segment.customers.length > 0 ? 
      Math.round(segment.customers.reduce((sum, c) => sum + c.metrics.monetary, 0) / segment.customers.length) : 0,
    color: segment.color,
    growthRate: 0
  }));
}

function performValueBasedSegmentation(customers: any[]) {
  const segments = [
    {
      id: 'high-frequency',
      name: 'High Frequency',
      description: 'Sık alışveriş yapan müşteriler',
      customers: customers.filter(c => c.metrics.frequency > 2),
      color: '#7C3AED'
    },
    {
      id: 'high-value',
      name: 'High Value',
      description: 'Yüksek tutarlı alışveriş yapan müşteriler',
      customers: customers.filter(c => c.metrics.monetary > 5000),
      color: '#DB2777'
    },
    {
      id: 'recent',
      name: 'Recent',
      description: 'Son dönemde aktif müşteriler',
      customers: customers.filter(c => c.metrics.recency <= 30),
      color: '#0891B2'
    }
  ];
  
  return segments.map(segment => ({
    id: segment.id,
    name: segment.name,
    description: segment.description,
    customerCount: segment.customers.length,
    averageValue: segment.customers.length > 0 ? 
      Math.round(segment.customers.reduce((sum, c) => sum + c.metrics.monetary, 0) / segment.customers.length) : 0,
    color: segment.color,
    growthRate: 0
  }));
}
