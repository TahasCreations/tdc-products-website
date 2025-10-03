import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BillingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    products: number;
    domains: number;
    storage: number; // GB
    ads: boolean;
    analytics: boolean;
    support: 'basic' | 'priority' | 'dedicated';
  };
  popular?: boolean;
}

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    description: 'Başlangıç için ideal',
    price: 0,
    currency: 'TRY',
    interval: 'monthly',
    features: [
      '10 ürün yükleme',
      'Temel analitik',
      'Email destek',
      'Temel tema seçenekleri'
    ],
    limits: {
      products: 10,
      domains: 0,
      storage: 1,
      ads: false,
      analytics: false,
      support: 'basic'
    }
  },
  {
    id: 'starter',
    name: 'Başlangıç',
    description: 'Küçük işletmeler için',
    price: 99,
    currency: 'TRY',
    interval: 'monthly',
    features: [
      '100 ürün yükleme',
      'Gelişmiş analitik',
      'Öncelikli destek',
      'Özel tema seçenekleri',
      'Temel reklam araçları'
    ],
    limits: {
      products: 100,
      domains: 1,
      storage: 10,
      ads: true,
      analytics: true,
      support: 'priority'
    }
  },
  {
    id: 'growth',
    name: 'Büyüme',
    description: 'Hızla büyüyen işletmeler için',
    price: 299,
    currency: 'TRY',
    interval: 'monthly',
    features: [
      '500 ürün yükleme',
      'Gelişmiş analitik',
      'Öncelikli destek',
      'Özel tema seçenekleri',
      'Gelişmiş reklam araçları',
      'API erişimi',
      'Toplu ürün yükleme'
    ],
    limits: {
      products: 500,
      domains: 3,
      storage: 50,
      ads: true,
      analytics: true,
      support: 'priority'
    },
    popular: true
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    description: 'Büyük işletmeler için',
    price: 599,
    currency: 'TRY',
    interval: 'monthly',
    features: [
      'Sınırsız ürün yükleme',
      'Gelişmiş analitik',
      'Dedicated destek',
      'Özel tema seçenekleri',
      'Gelişmiş reklam araçları',
      'API erişimi',
      'Toplu ürün yükleme',
      'Özel entegrasyonlar',
      'White-label seçenekleri'
    ],
    limits: {
      products: -1, // Unlimited
      domains: 10,
      storage: 200,
      ads: true,
      analytics: true,
      support: 'dedicated'
    }
  }
];

export interface SubscriptionData {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  metadata?: Record<string, any>;
}

export async function getActiveSubscription(userId: string): Promise<SubscriptionData | null> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!subscription) return null;

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status as any,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      trialEnd: subscription.trialEnd || undefined,
      metadata: subscription.metadata as Record<string, any> || {}
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function createSubscription(
  userId: string,
  planId: string,
  paymentMethodId?: string
): Promise<SubscriptionData | null> {
  try {
    const plan = BILLING_PLANS.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        metadata: {
          paymentMethodId,
          createdAt: new Date().toISOString()
        }
      }
    });

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status as any,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      trialEnd: subscription.trialEnd || undefined,
      metadata: subscription.metadata as Record<string, any> || {}
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return null;
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        status: 'cancelled'
      }
    });
    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }
}

export async function getSubscriptionUsage(userId: string): Promise<{
  products: number;
  domains: number;
  storage: number;
}> {
  try {
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        products: true,
        domains: true
      }
    });

    if (!seller) {
      return { products: 0, domains: 0, storage: 0 };
    }

    // Calculate storage usage (simplified)
    const storageUsage = 0; // This would need to be calculated based on actual file sizes

    return {
      products: seller.products.length,
      domains: seller.domains.length,
      storage: storageUsage
    };
  } catch (error) {
    console.error('Error fetching subscription usage:', error);
    return { products: 0, domains: 0, storage: 0 };
  }
}

export function getPlanById(planId: string): BillingPlan | null {
  return BILLING_PLANS.find(plan => plan.id === planId) || null;
}

export function formatPrice(price: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(price);
}

export function calculateYearlyDiscount(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * 0.2); // 20% discount for yearly
}

export const ENTITLEMENTS_DESC = {
  'ads': 'Reklam araçları ve kampanya yönetimi',
  'analytics': 'Gelişmiş analitik ve raporlama',
  'api': 'API erişimi ve entegrasyonlar',
  'bulk-upload': 'Toplu ürün yükleme',
  'custom-domains': 'Özel domain desteği',
  'keyword-tool': 'Anahtar kelime analiz araçları',
  'priority-support': 'Öncelikli müşteri desteği',
  'white-label': 'White-label çözümler'
};

// Export PLANS as alias for BILLING_PLANS
export const PLANS = BILLING_PLANS;
