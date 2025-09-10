import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock customer data
    const customers = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+905551234567',
        company: 'ABC Şirketi',
        segment: 'VIP',
        status: 'active',
        totalOrders: 25,
        totalSpent: 45000,
        averageOrderValue: 1800,
        lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Website',
        tags: ['VIP', 'Sadık Müşteri'],
        notes: 'Çok memnun müşteri, özel kampanyalar için öncelikli',
        assignedTo: 'Satış Ekibi',
        leadScore: 95,
        lifetimeValue: 45000,
        churnRisk: 'low',
        preferences: {
          categories: ['Elektronik', 'Ev & Yaşam'],
          brands: ['Samsung', 'Apple'],
          priceRange: { min: 1000, max: 5000 },
          communication: 'email'
        }
      },
      {
        id: '2',
        name: 'Mehmet Kaya',
        email: 'mehmet@example.com',
        phone: '+905559876543',
        company: 'XYZ Ltd.',
        segment: 'Premium',
        status: 'active',
        totalOrders: 15,
        totalSpent: 25000,
        averageOrderValue: 1667,
        lastOrderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        registrationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Referans',
        tags: ['Premium', 'Kurumsal'],
        notes: 'Kurumsal müşteri, toplu alımlar yapıyor',
        assignedTo: 'Kurumsal Satış',
        leadScore: 85,
        lifetimeValue: 25000,
        churnRisk: 'low',
        preferences: {
          categories: ['Ofis', 'Teknoloji'],
          brands: ['Dell', 'HP'],
          priceRange: { min: 500, max: 3000 },
          communication: 'phone'
        }
      },
      {
        id: '3',
        name: 'Ayşe Demir',
        email: 'ayse@example.com',
        phone: '+905556543210',
        company: 'DEF A.Ş.',
        segment: 'Standard',
        status: 'active',
        totalOrders: 8,
        totalSpent: 12000,
        averageOrderValue: 1500,
        lastOrderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Sosyal Medya',
        tags: ['Standard', 'Yeni Müşteri'],
        notes: 'Yeni müşteri, potansiyeli yüksek',
        assignedTo: 'Satış Ekibi',
        leadScore: 70,
        lifetimeValue: 12000,
        churnRisk: 'medium',
        preferences: {
          categories: ['Moda', 'Kozmetik'],
          brands: ['Nike', 'Adidas'],
          priceRange: { min: 200, max: 1000 },
          communication: 'email'
        }
      },
      {
        id: '4',
        name: 'Fatma Özkan',
        email: 'fatma@example.com',
        phone: '+905557890123',
        company: 'GHI Şirketi',
        segment: 'Basic',
        status: 'inactive',
        totalOrders: 3,
        totalSpent: 2500,
        averageOrderValue: 833,
        lastOrderDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        registrationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Google Ads',
        tags: ['Basic', 'Risk Altında'],
        notes: 'Uzun süre alışveriş yapmadı, takip edilmeli',
        assignedTo: 'Müşteri Hizmetleri',
        leadScore: 45,
        lifetimeValue: 2500,
        churnRisk: 'high',
        preferences: {
          categories: ['Ev & Yaşam'],
          brands: ['IKEA'],
          priceRange: { min: 100, max: 500 },
          communication: 'sms'
        }
      }
    ];

    return NextResponse.json(customers);

  } catch (error) {
    console.error('CRM customers error:', error);
    return NextResponse.json(
      { error: 'Müşteri verileri alınamadı' },
      { status: 500 }
    );
  }
}
